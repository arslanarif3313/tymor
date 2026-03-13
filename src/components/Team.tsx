"use client";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const team: TeamMember[] = [
  { name: "Halvam Alvida", role: "Co-Ordinator", image: "/images/team/team-1.webp" },
  { name: "Sajran Safina", role: "Co-Ordinator", image: "/images/team/team-2.webp" },
  { name: "Malhar Morshed", role: "Co-Ordinator", image: "/images/team/team-3.webp" },
  { name: "Ravian Rahima", role: "Co-Ordinator", image: "/images/team/team-4.webp" },
];

export default function Team() {
  return (
    <section className="team-section py-5">
      <div className="container">
        {/* top row */}
        <div className="row align-items-end mb-5">
          <div className="col-md-3 text-md-start text-center small-title">
            Who we are
          </div>
          <div className="col-md-6 text-center">
            <h2 className="team-heading">MEET THE<br />TALENTED TEAM</h2>
          </div>
          <div className="col-md-3 text-md-end text-center mt-3 mt-md-0">
            <a href="#" className="discover-link">Discover All ↗</a>
          </div>
        </div>

        {/* team grid */}
        <div className="row g-4">
          {team.map((member, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="team-card">
                <div className="team-img-wrap">
                  <img src={member.image} className="img-fluid" alt={member.name} />
                  <div className="team-social">
                    <a href="#"><i className="bi bi-facebook"></i></a>
                    <a href="#"><i className="bi bi-twitter-x"></i></a>
                    <a href="#"><i className="bi bi-instagram"></i></a>
                  </div>
                </div>
                <h5>{member.name}</h5>
                <span>{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
