import { CORE_CONCEPTS } from "./data";
import CoreConcept from "./components/CoreConcept";
import TabButton from "./components/TabButton";
import { useState } from "react";
const reactDescription = ["Fundamental", "Crucial", "Core"];
function getRand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function Header() {
  const desc = reactDescription[getRand(2)];
  return (
    <header>
      <img src="src/assets/react-core-concepts.png" alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {desc} React concepts you will need for almost any app you are going to
        build!
      </p>
    </header>
  );
}
function App() {
  console.log("App Component Rendering");
  const [ selectedTopic, setSelectedTopic] = useState('Please select the Topic');
  function handleSelect(inp){
    setSelectedTopic(inp);
  };
  return (
    <div>
      <main>
        <Header />
        <h2>Time to get started!</h2>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            <CoreConcept
            image={CORE_CONCEPTS[0].image}
              title={CORE_CONCEPTS[0].title}
              description={CORE_CONCEPTS[0].description}
            />
            <CoreConcept
            {...CORE_CONCEPTS[1]}
            />
            <CoreConcept
            {...CORE_CONCEPTS[2]}
            />
            <CoreConcept
            {...CORE_CONCEPTS[3]}
            />
          </ul>
        </section>
        <section id="examples">
          <menu>
            <TabButton onSelect={()=>handleSelect("components")}>
              Components
            </TabButton>
            <TabButton onSelect={()=>handleSelect("jsx")}>
              Jsx
            </TabButton>
            <TabButton onSelect={()=>handleSelect("props")}>
              Props
            </TabButton>
            <TabButton onSelect={()=>handleSelect("state")}>
              State
            </TabButton>
            
          </menu>
          <p>{selectedTopic}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
