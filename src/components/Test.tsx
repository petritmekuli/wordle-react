import { useState } from "react";

function Test() {
  const [items, setItems] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleAddItem = (newItem: string) => {
    const prevLength = items.length;

    // Update the state with the new item
    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      // Check if the new item was actually added (i.e., array length increased)
      if (Math.random() >= 0.5) {
        setMessage("A new item was added. Length: " + updatedItems.length);
        return updatedItems;
      } else {
        setMessage("No new items were added. Length: " + prevItems.length);
        return prevItems;
      }
    });
  };

  return (
    <div>
      <button onClick={() => handleAddItem("New Item")}>Add Item</button>
      <p>Message: {message}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
export default Test;
