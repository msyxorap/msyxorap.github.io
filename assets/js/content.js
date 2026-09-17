const CONTENT = {

  /* ---------- opening screen ---------- */
  home: {
    lines: [
      "LUCAS LUTAR",
      "I hope you enjoy the silly website!",
      "MSc Economics & Policy, King's College London.",
      "  Distinction expected, Sep 2026.",
      "BA Economics, Cornell. GPA 3.74, Dean's List.",
      "Choose an option below."
    ]
  },

  /* ---------- RESEARCH ---------- */
  research: {
    label: "RESEARCH",
    blurb: "* What I've worked on.",
    prompt: "* Hope you enjoy!",
    list: [
      {
        name: "TAN LINES AND STATE LINES",
        lines: [
          "MSc Dissertation, King's College London, 2026.",
          "  10,899 words.",
          "Tourism, housing pressure and resident",
          "  out-migration from Hawaiʻi.",
          "Built two original county-year panels: Hawaiʻi",
          "  1990-2022, and a 1,000+ county national panel,",
          "  harmonising six government sources across three",
          "  incompatible file-format eras.",
          "Fixed-effects models with inference that survives",
          "  four clusters — wild cluster bootstrap and",
          "  Driscoll-Kraay errors — plus two natural",
          "  experiments: Hurricane Iniki (1992) and a",
          "  COVID-19 synthetic control for Maui.",
          "The two channels run in opposite directions at",
          "  once. Visitor volume pushes residents out through",
          "  the housing margin; tourism employment holds",
          "  them in place.",
          "Every script, every raw file, every table is",
          "  public."
        ],
        link: { href: "https://github.com/msyxorap/hawaii_tourism_migration", label: "OPEN THE REPOSITORY" }
      },
      {
        name: "THE DEVELOPMENT TAX ON MOBILITY",
        lines: [
          "King's Think Tank Blog, January 2026.",
          "Recruitment fees, remittance costs and policy",
          "  shocks as structural frictions in labour",
          "  migration.",
          "Built on World Bank, ILO and UN DESA data."
        ]
      }
    ]
  },

  /* ---------- EXPERIENCE ---------- */
  experience: {
    label: "EXPERIENCE",
    blurb: "* Where I've worked.",
    prompt: "* Which one do ya wanna see?",
    list: [
      {
        name: "EPIC SYSTEMS",
        lines: [
          "Project Manager, Healthcare Data & Billing.",
          "  Madison, WI. Jan 2025 - Aug 2025.",
          "Built dashboards in Slicer Dicer and Clarity,",
          "  analysing hospital operational and billing data",
          "  for hospital leadership.",
          "Maintained Excel billing-quality reports with",
          "  macros: tracked claims falling through the",
          "  coding process, found root causes, corrected",
          "  and re-tested.",
          "Led Penn State Health's billing implementation",
          "  transition and trained specialist teams.",
          "  Supported OCHIN Epic rollouts.",
          "Demoed to senior executives and aligned",
          "  roadmaps with business outcomes."
        ]
      },
      {
        name: "KING'S THINK TANK",
        lines: [
          "Policy Analyst, Migration Economics.",
          "  Nov 2025 - Aug 2026.",
          "Analysed recruitment fees, remittance costs and",
          "  policy shocks as frictions in labour migration.",
          "Published \"The Development Tax on Mobility\","
          + " Jan 2026."
        ]
      },
      {
        name: "AMAZON",
        lines: [
          "HR Business Partner, Data & Process.",
          "  Carteret, NJ. Jun 2024 - Aug 2024.",
          "Led regional research across six sites.",
          "Identified process improvements that cut",
          "  attrition by a projected 50% at my site.",
          "Assessed how organisational changes hit",
          "  employee outcomes and productivity."
        ]
      },
      {
        name: "MAPLELANE CAPITAL",
        lines: [
          "Analyst, Investment Data & Modeling.",
          "  New York, NY. May 2024 - Jun 2024.",
          "Analysed alternative datasets — credit-card",
          "  transactions, web traffic — to surface trends",
          "  in stock volume and demand.",
          "Built revenue projections, cost analyses and key",
          "  statements; ran scenario and sensitivity",
          "  analysis to sharpen forecasts."
        ]
      },
      {
        name: "SILVER POINT CAPITAL",
        lines: [
          "Intern, Data & Vendor Analysis.",
          "  Greenwich, CT. Jun 2023 - Aug 2023.",
          "Built a master vendor Excel model with macros",
          "  consolidating agreements across 300+ recruiting",
          "  agencies, to control fund expenses.",
          "Created structured datasets of 300+ firms.",
          "Monitored expert calls for SEC compliance."
        ]
      },
      {
        name: "CORNELL UNIVERSITY",
        lines: [
          "Teaching Assistant, Introduction to",
          "  Microeconomics. Fall 2024.",
          "Supported a ~200-student lecture course.",
          "Weekly office hours, instruction and tutoring."
        ]
      }
    ]
  },

  /* ---------- SKILLS and misc area ---------- */
  skills: {
    label: "SKILLS",
    blurb: "* What I can do.",
    prompt: "* Choose Choose Choose",
    list: [
      {
        name: "CODE I'M FAMILIAR WITH",
        lines: [
          "Python, R, Stata, SQL, GDScript.",
          "Python is the working language: pandas,",
          "  statsmodels, NumPy, matplotlib.",
          "GDScript came from building the RPG."
        ]
      },
      {
        name: "METHODS",
        lines: [
          "Econometrics and causal inference.",
          "Natural-experiment and quasi-experimental",
          "  design. Fixed-effects panel models.",
          "Synthetic control. Wild cluster bootstrap.",
          "  Driscoll-Kraay standard errors.",
          "Scenario and sensitivity analysis."
        ]
      },
      {
        name: "DATA & REPORTING o7",
        lines: [
          "Panel construction from numerous publically available",
          "   data sources",
          "Cleaning and wrangling; documented series",
          "Advanced Excel: modelling, macros, automation.",
          "Financial modelling, dashboards, data visualization."
        ]
      },
      {
        name: "FENCING!",
        lines: [
          "Captain, Peruvian National Fencing Team.",
          "Gold medal for Peru, 2022 Bolivarian Games.",
          "Ranked top 200 globally."
        ]
      },
      {
        name: "2D GAME :D",
        lines: [
          "A complete 2D role-playing game, built alone",
          "  in Godot and GDScript.",
          "CHeck it out when I eventually drop it!",
          "Of course when I get a job though..."
        ]
      },
      {
        name: "TREASURER $$!$!",
        lines: [
          "Treasurer (Exchequer), Sigma Alpha Mu.",
          "Managed $350,000+ in housing and event funds."
        ]
      }
    ]
  },

  /* ---------- CONTACT ---------- */
  contact: {
    label: "CONTACT",
    blurb: "* Hai, I am reachable at these areas.",
    prompt: "* Click 'em!",
    list: [
      {
        name: "EMAIL",
        lines: ["Here I am!! lucasnlutar@gmail.com"],
        link: { href: "mailto:lucasnlutar@gmail.com", label: "SEND MAIL" }
      },
      {
        name: "GITHUB",
        lines: ["You could just go to the homepage, but I guess"],
        link: { href: "https://github.com/msyxorap/hawaii_tourism_migration", label: "OPEN GITHUB" }
      },
      {
        name: "LINKEDIN",
        lines: ["Check it out here!!"],
        link: { href: "https://www.linkedin.com/in/lucas-lutar/", label: "OPEN LINKEDIN" }
      },
      {
        name: "DOWNLOAD CV",
        lines: ["Attached below!"],
        link: { href: "assets/cv.pdf", label: "DOWNLOAD PDF", download: true }
      }
    ]
  }
};
