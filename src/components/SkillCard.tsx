import { Bookmark, Check, Copy, ExternalLink, MessageSquare, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

type SkillCardProps = {
	skill: SkillRecord;
};

const formatDate = (date: string | null) => {
	if (!date) {
		return "Draft";
	}

	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
};

const SkillCard = ({ skill }: SkillCardProps) => {
	const [isCopied, setIsCopied] = useState(false);

	const copyInstallCommand = async () => {
		await navigator.clipboard.writeText(skill.installCommand);
		setIsCopied(true);
		window.setTimeout(() => setIsCopied(false), 1500);
	};

	return (
		<article className="skill-card">

        <Link to='/skills' tabIndex={-1}
        aria-label={`open ${skill.title} skill details`}/>

			<div className="overlay" />

			<div className="chrome">
				<div className="chrome-bar">
					<div className="lights">
						<span className="light red" />
						<span className="light amber" />
						<span className="light green" />
					</div>
					<span className="host">skilld.dev/{skill.slug}</span>
				</div>
			</div>

			<div className="body">
				<div className="meta">
					<div className="author">
						<div className="avatar bg-accent-primary/20" />
						<div className="author-copy">
							<p>{skill.authorEmail ?? "anonymous@example.com"}</p>
							<p>{formatDate(skill.createdAt)}</p>
						</div>
					</div>
					<span className="category">{skill.category}</span>
				</div>

				<div className="summary">
					<Link className="title-link" to="/">
						<h3>{skill.title}</h3>
					</Link>
					<p>{skill.description}</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{skill.tags.map((tag) => (
						<span
							className="rounded-md bg-tag-bg px-2.5 py-1 text-xs text-text-muted"
							key={tag}
						>
							{tag}
						</span>
					))}
				</div>

				<div className="command">
					<div className="command-copy">
						<span>$</span>
						<p>{skill.installCommand}</p>
					</div>
					<button
						className="copy cursor-alias"
						type="button"
						onClick={copyInstallCommand}
						aria-label={isCopied ? "Install command copied" : "Copy install command"}
					>
						{isCopied ? <Check size={16} /> : <Copy size={16} />}
					</button>
				</div>

				<div className="footer">
					<div className="stats">
						<div className="upvote">
							<Star size={15} />
							<span>24</span>
						</div>
						<div className="comments">
							<MessageSquare size={15} />
							<span>8</span>
						</div>
					</div>

                    
                    <div className="flex gap-5">					<div className="actions">
						<Link className="open" to="/skills">
							Open <ExternalLink size={14} />
						</Link>
					</div>
                    <button
                    type="button"
                    className="save"
                    aria-label="Save skill"
                    disabled>
                        <Bookmark size={15} />
                    </button>
				</div>
                </div>
			</div>
		</article>
	);
};

export default SkillCard;
