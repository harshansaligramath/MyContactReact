import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";
import Notfound from "./pages/Notfound";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";

function App() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    const getContacts = async () => {
      const contactsFormServer = await fetchContacts();
      setContacts(contactsFormServer);
    };

    getContacts();
  }, []);

  const formSub = async (data) => {
    const res = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newdata = await res.json();
    if (res.ok) {
      setContacts([...contacts, newdata]);
    }
    // console.log(data);
  };
  // get all contact
  const fetchContacts = async () => {
    const res = await fetch("http://localhost:3000/contacts");
    const data = await res.json();

    return data;
  };
  //delete contact
  const deleteContact = async (id) => {
    const res = await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      let newContact = contacts.filter((singleContact) => {
        return singleContact.id !== id;
      });

      setContacts(newContact);
    }
  };

  // get single contact
  const getCon = async (id) => {
    const res = await fetch(`http://localhost:3000/contacts/${id}`);
    const data = await res.json();

    return data;
  };

  //favourite button/favtoggle
  const favToggle = async (id) => {
    const singleCon = await getCon(id);
    const updTask = { ...singleCon, fav: !singleCon.fav };
    const res = await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });
    if (res.status === 200) {
      let updatedContact = contacts.map((singleContact) => {
        return singleContact.id === id
          ? { ...singleContact, fav: !singleContact.fav }
          : singleContact;
      });
      setContacts(updatedContact);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <Nav />
      </div>

      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              formSub={formSub}
              contacts={contacts}
              favToggle={favToggle}
              deleteContact={deleteContact}
            />
          }
        />
        <Route
          exact
          path="favourite"
          element={
            <Favourite
              contacts={contacts}
              favToggle={favToggle}
              deleteContact={deleteContact}
            />
          }
        />
        <Route exact path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
