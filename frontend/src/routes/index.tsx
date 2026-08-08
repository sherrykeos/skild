import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "../components/SkillCard";
import { Skills } from "../data/skills";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						The Registry for <br />
						<span className="text-gradient">Agentic Intelligent</span>
					</h1>
					<p>
						A high-performance registry for procedural agent skills. discover,
						share, and manage your agentic intelligent skills with ease.
					</p>
				</div>

				<div className="actions">
					<Link to="/" className="btn-primary">
						<Terminal />
						Explore Skills
					</Link>
					<Link to="/" className="btn-secondary">
						Publish Skills
					</Link>
				</div>
			</section>

			<section className="latest">
				<div className="space-y-2">
					<h2>
						Recently Published <span className="text-gradient">Skills</span>
					</h2>
					<p>Explore the latest skills added to the registry.</p>
				</div>

				<div>
          {Skills.length > 0 ? (
            <div className="skills-grid">            
            {Skills.map((skill) => (
						<SkillCard key={skill.id} skill={skill} />
					))}
           </div>
          )
        :(
          <p>No skills published yet.....</p>
        )}
					
				</div>

			</section>
		</div>
	);
}
