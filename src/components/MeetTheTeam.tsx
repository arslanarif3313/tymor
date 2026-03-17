"use client";

import { motion } from "framer-motion";

const teamMembers = [
  { id: 1, type: "image", src: "/images/clients/client-1.png", name: "James Whitfield", role: "CEO & Founder" },
  { id: 2, type: "text", name: "Visionary", role: "Leadership" },
  { id: 3, type: "image", src: "/images/clients/client-2.png", name: "Sofia Chen", role: "Strategic Lead" },
  { id: 4, type: "text", name: "Innovation", role: "Product Architecture" },
  { id: 5, type: "image", src: "/images/clients/client-3.png", name: "Marcus Andersen", role: "Operations Head" },
  { id: 6, type: "text", name: "Global", role: "Deployment" },
  { id: 7, type: "image", src: "/images/clients/client-4.png", name: "Diana Reeves", role: "Brand Experience" },
  { id: 8, type: "text", name: "Creative", role: "MetaHuman Design" },
];

export default function MeetTheTeam() {
  return (
    <section className="meet-team py-5 overflow-hidden bg-white">
      <div className="container text-center mb-5">
        <h2 className="display-2 fw-bold text-uppercase anton-font" style={{ color: "var(--accent)" }}>WHO WE ARE</h2>
        <div className="d-flex align-items-center justify-content-center gap-3">
          <div style={{ height: "1px", width: "40px", backgroundColor: "rgba(0,0,0,0.1)" }}></div>
          <p className="text-secondary text-uppercase tracking-[0.3em] font-mono small m-0">Leadership & Innovation</p>
          <div style={{ height: "1px", width: "40px", backgroundColor: "rgba(0,0,0,0.1)" }}></div>
        </div>
      </div>

      <div className="marquee marquee-left">
        <div className="marquee-inner">
          {teamMembers.map((member) => (
             <TeamCard key={member.id} member={member} />
          ))}
          {/* Duplicate for seamless loop */}
          {teamMembers.map((member) => (
             <TeamCard key={`${member.id}-dup`} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: any }) {
  if (member.type === "image") {
    return (
      <div className="team-card-img">
        <img src={member.src} alt={member.name} className="w-100 h-100 object-fit-cover" style={{ filter: "grayscale(20%)" }} />
        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
          <h4 className="text-white fw-bold mb-1">{member.name}</h4>
          <p className="text-primary font-mono small m-0 text-uppercase tracking-wider" style={{ fontSize: "10px" }}>{member.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-card-text d-flex flex-column justify-content-center align-items-center p-5 text-center">
      <div className="mb-4" style={{ height: "1px", width: "60px", background: "var(--accent)" }}></div>
      <h2 className="anton-font text-uppercase" style={{ color: "#000", fontSize: "3.5rem", lineHeight: "1" }}>{member.name}</h2>
      <p className="text-primary text-uppercase font-mono small mt-3" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>{member.role}</p>
      <div className="mt-4" style={{ height: "1px", width: "60px", background: "var(--accent)" }}></div>
    </div>
  );
}
