# Learning Ripple Effect

**Generative AI & Student Learning · Interactive Data Exploration**

[Open the interactive demo →](https://yifeng-lab.github.io/learning-ripple-effect/) · [Read the report (PDF) →](Learning-Ripple-Effect-Report.pdf)

## Focus

How do university students perceive generative AI in their learning?

- **AI literacy:** understanding limitations, factual inaccuracies and bias.
- **Learning opportunities:** personalized feedback and digital competence.
- **Learning concerns:** over-reliance, social interaction and transferable skills.

The project turns survey responses into concentric-circle visualizations, combining agreement levels with chatbot-use frequency.

## Data & interaction

The original work uses **131 university-student responses** from Jocelyn Dumlao’s [Chatbots’ Impact on University Learning](https://www.kaggle.com/datasets/jocelyndumlao/chatbots-impact-on-university-learning) dataset, collected in May 2023. These are secondary data, not a survey collected by the project team.

The live demo uses **131 clearly labelled synthetic records across 28 attitude items**. Filter by degree, major or gender; hover over a response; select a question for an expanded view. The synthetic demo illustrates the interaction, not empirical findings.

## Report & collaboration

**The Learning Ripple Effect of Generative AI**  
*Student Perceptions and Interactive Data Visualization*

Report co-authors: **Jingjing Sun, Yi Feng and Jui-chien Chen**. Yi Feng participated across project stages and co-authored the report.

The original implementation combined Python, SQLite, React, D3.js and Express. This portfolio edition presents the interaction with plain HTML, CSS and JavaScript / SVG for direct browser viewing.

## Files & local use

- `index.html`, `styles.css`, `app.js`: page, styling and interaction.
- `data.js`: synthetic demo records.
- `prepare_data.py`: reproducible pandas → SQLite → demo-data pipeline.
- `Learning-Ripple-Effect-Report.pdf`: project report.

Download the repository and open `index.html` in a browser. To regenerate demo data, install pandas and run `python prepare_data.py`; generated CSV / SQLite files stay in the ignored `build/` folder.
