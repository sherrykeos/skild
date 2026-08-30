import ApiError from "../../utils/ApiError.js";
import {
  parseGitHubUrl,
  getRepository,
  getBranches,
  getRepositoryTree,
  getFileContent,
} from "./github.client.js";
import {
  findExistingGithubImport,
  findSkillBySlug,
  createImportedSkill,
} from "./github.repository.js";

let testClientOverrides = null;

export function __setClientOverrides(overrides) {
  testClientOverrides = overrides;
}

function getClient() {
  return {
    parseGitHubUrl,
    getRepository: testClientOverrides?.getRepository || getRepository,
    getBranches: testClientOverrides?.getBranches || getBranches,
    getRepositoryTree: testClientOverrides?.getRepositoryTree || getRepositoryTree,
    getFileContent: testClientOverrides?.getFileContent || getFileContent,
  };
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_FILES = 50;

const ALLOWED_EXTENSIONS = new Set([
  "md", "txt", "json", "yaml", "yml", "js", "jsx", "ts", "tsx",
  "py", "rb", "go", "java", "rs", "sh", "bash", "css", "html",
  "xml", "csv", "svg", "toml", "ini", "example", "dockerfile", "gitignore",
]);

/**
 * Infer MIME type based on file path extension.
 */
function getMimeType(filePath) {
  const normalized = filePath.toLowerCase();

  if (normalized.endsWith(".md")) return "text/markdown";
  if (normalized.endsWith(".json")) return "application/json";
  if (normalized.endsWith(".js") || normalized.endsWith(".jsx")) return "text/javascript";
  if (normalized.endsWith(".ts") || normalized.endsWith(".tsx")) return "text/plain";
  if (normalized.endsWith(".py")) return "text/x-python";
  if (normalized.endsWith(".yaml") || normalized.endsWith(".yml")) return "text/yaml";
  if (normalized.endsWith(".html")) return "text/html";
  if (normalized.endsWith(".css")) return "text/css";
  if (normalized.endsWith(".svg")) return "image/svg+xml";
  if (normalized.endsWith(".xml")) return "application/xml";

  return "text/plain";
}

/**
 * Extract file extension and check if text format is supported.
 */
function isAllowedFileFormat(filePath) {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];

  if (fileName.startsWith(".")) {
    const extWithoutDot = fileName.slice(1).toLowerCase();
    if (ALLOWED_EXTENSIONS.has(extWithoutDot)) return true;
  }

  const dotIdx = fileName.lastIndexOf(".");
  if (dotIdx === -1) return true;

  const ext = fileName.slice(dotIdx + 1).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Generate a clean URL-friendly slug.
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate a unique skill slug.
 */
async function generateUniqueSlug(name) {
  let baseSlug = generateSlug(name);
  if (!baseSlug) {
    baseSlug = "imported-skill";
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await findSkillBySlug(slug);
    if (!existing) {
      return slug;
    }
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

/**
 * Inspect public repository metadata & available branches.
 */
export async function inspectRepository(url) {
  const client = getClient();
  const parsed = client.parseGitHubUrl(url);
  if (!parsed) {
    throw new ApiError(400, "Invalid GitHub repository URL.", "GITHUB_INVALID_URL");
  }

  const { owner, repo } = parsed;

  const [repoData, branchesData] = await Promise.all([
    client.getRepository(owner, repo),
    client.getBranches(owner, repo),
  ]);

  return {
    repository: {
      owner: repoData.owner?.login || owner,
      name: repoData.name,
      fullName: repoData.full_name,
      defaultBranch: repoData.default_branch,
      description: repoData.description || "",
      htmlUrl: repoData.html_url,
    },
    branches: branchesData.map((b) => ({
      name: b.name,
      protected: b.protected ?? false,
    })),
  };
}

/**
 * Get repository tree for a specific branch.
 */
export async function getTree(url, branch) {
  const client = getClient();
  const parsed = client.parseGitHubUrl(url);
  if (!parsed) {
    throw new ApiError(400, "Invalid GitHub repository URL.", "GITHUB_INVALID_URL");
  }

  const { owner, repo } = parsed;
  const treeData = await client.getRepositoryTree(owner, repo, branch);

  const files = (treeData.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => ({
      path: item.path,
      type: "file",
      size: item.size || 0,
    }));

  return {
    branch,
    files,
  };
}

/**
 * Import selected files from GitHub repository as a DRAFT Skill.
 */
export async function importSkill(userId, { url, branch, files }) {
  const client = getClient();
  const parsed = client.parseGitHubUrl(url);
  if (!parsed) {
    throw new ApiError(400, "Invalid GitHub repository URL.", "GITHUB_INVALID_URL");
  }

  const { owner, repo } = parsed;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new ApiError(400, "At least one file must be selected.", "INVALID_INPUT");
  }

  if (files.length > MAX_FILES) {
    throw new ApiError(400, `Cannot import more than ${MAX_FILES} files.`, "GITHUB_TOO_MANY_FILES");
  }

  if (!files.includes("SKILL.md")) {
    throw new ApiError(400, "SKILL.md must be included in selected files.", "SKILL_MD_REQUIRED");
  }

  const repoData = await client.getRepository(owner, repo);
  const canonicalUrl = repoData.html_url;

  const duplicate = await findExistingGithubImport(userId, canonicalUrl, branch);
  if (duplicate) {
    throw new ApiError(409, "You have already imported this GitHub repository and branch.", "GITHUB_DUPLICATE_IMPORT");
  }

  const treeData = await client.getRepositoryTree(owner, repo, branch);
  const treeItemsMap = new Map();
  (treeData.tree || []).forEach((item) => {
    treeItemsMap.set(item.path, item);
  });

  for (const filePath of files) {
    const treeItem = treeItemsMap.get(filePath);

    if (!treeItem || treeItem.type !== "blob") {
      throw new ApiError(404, `Selected file '${filePath}' does not exist in branch '${branch}'.`, "GITHUB_FILE_NOT_FOUND");
    }

    if (treeItem.size && treeItem.size > MAX_FILE_SIZE) {
      throw new ApiError(413, `File '${filePath}' exceeds the 1 MB size limit.`, "GITHUB_FILE_TOO_LARGE");
    }

    if (!isAllowedFileFormat(filePath)) {
      throw new ApiError(400, `File '${filePath}' has an unsupported file format for V1 import.`, "GITHUB_FILE_UNSUPPORTED");
    }
  }

  const fetchedFiles = await Promise.all(
    files.map(async (filePath) => {
      const fileData = await client.getFileContent(owner, repo, filePath, branch);
      return {
        path: filePath,
        content: fileData.content,
        mimeType: getMimeType(filePath),
      };
    }),
  );

  const skillMdFile = fetchedFiles.find((f) => f.path === "SKILL.md");
  if (!skillMdFile || !skillMdFile.content || skillMdFile.content.trim().length === 0) {
    throw new ApiError(400, "SKILL.md file cannot be empty.", "SKILL_MD_EMPTY");
  }

  const skillName = repoData.name;
  const skillDescription = repoData.description || `Skill imported from ${repoData.full_name}`;
  const slug = await generateUniqueSlug(skillName);

  const createdSkill = await createImportedSkill({
    name: skillName,
    slug,
    description: skillDescription,
    authorId: userId,
    sourceUrl: canonicalUrl,
    sourceBranch: branch,
    files: fetchedFiles,
  });

  const createdVersion = createdSkill.versions[0];

  return {
    skill: {
      id: createdSkill.id,
      name: createdSkill.name,
      slug: createdSkill.slug,
      description: createdSkill.description,
      status: createdSkill.status,
      sourceType: createdSkill.sourceType,
      sourceUrl: createdSkill.sourceUrl,
      version: {
        id: createdVersion.id,
        version: createdVersion.version,
        sourceBranch: createdVersion.sourceBranch,
        files: createdVersion.files.map((f) => ({
          path: f.path,
          mimeType: f.mimeType,
        })),
      },
    },
  };
}
