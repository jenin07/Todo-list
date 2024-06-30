import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';

function App () {
  // State to manage the display of Todo or Completed screen
  const [isCompleteScreen, setIsCompleteScreen] = useState (false);
  // State to hold the list of all todos
  const [allTodos, setTodos] = useState ([]);
  // State to hold the new todo's title
  const [newTitle, setNewTitle] = useState ('');
  // State to hold the new todo's description
  const [newDescription, setNewDescription] = useState ('');
  // State to hold the list of completed todos
  const [completedTodos, setCompletedTodos] = useState ([]);
  // State to manage the current todo being edited
  const [currentEdit, setCurrentEdit] = useState ("");
  // State to hold the details of the current todo being edited
  const [currentEditedItem, setCurrentEditedItem] = useState ("");

  // Function to add a new todo item
  const handleAddTodo = () => {
    // Creating a new todo object
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    // Updating the todo list state
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push (newTodoItem);
    setTodos (updatedTodoArr);
    // Saving the updated todo list to localStorage
    localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));
  };

  // Function to delete a todo item
  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    // Removing the specific item by index
    reducedTodo.splice (index, 1); 

    // Updating localStorage and state
    localStorage.setItem ('todolist', JSON.stringify (reducedTodo));
    setTodos (reducedTodo);
  };

  // Function to mark a todo item as complete
  const handleComplete = index => {
    // Creating a timestamp for the completion
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    // Creating a completed todo object
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    // Updating the completed todo list state
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push (filteredItem);
    setCompletedTodos (updatedCompletedArr);
    handleDeleteTodo (index); // Remove the todo from allTodos after completing it
    // Saving the updated completed todo list to localStorage
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  };

  // Function to delete a completed todo item
  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    // Removing the specific item by index
    reducedTodo.splice (index, 1); 

    // Updating localStorage and state
    localStorage.setItem ('completedTodos', JSON.stringify (reducedTodo));
    setCompletedTodos (reducedTodo);
  };

  // useEffect hook to load saved todos and completed todos from localStorage when the component mounts
  useEffect (() => {
    let savedTodo = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedTodo = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    if (savedTodo) {
      setTodos (savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos (savedCompletedTodo);
    }
  }, []);

  // Function to start editing a todo item
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  // Function to update the title of the currently edited item
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return {...prev, title: value};
    });
  };

  // Function to update the description of the currently edited item
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return {...prev, description: value};
    });
  };

  // Function to save the updated todo item
  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
  };

  return (
    <div className="App">
      <h1>My Todo-List</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle (e.target.value)}
              placeholder="To-Do"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen (false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {/* Display list of todos or completed todos based on the screen state */}
          {isCompleteScreen === false &&
            allTodos.map ((item, index) => {
              if(currentEdit === index){
                 return (
                   <div className='edit__wrapper' key={index}>
                     <input 
                       placeholder='Updated Title' 
                       onChange={(e) => handleUpdateTitle(e.target.value)} 
                       value={currentEditedItem.title} 
                     />
                     <textarea 
                       placeholder='Updated Description' 
                       rows={4}
                       onChange={(e) => handleUpdateDescription(e.target.value)} 
                       value={currentEditedItem.description} 
                     />
                     <button
                       type="button"
                       onClick={handleUpdateToDo}
                       className="primaryBtn"
                     >
                       Update
                     </button>
                   </div> 
                 ); 
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo (index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete (index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit 
                        className="check-icon"
                        onClick={() => handleEdit (index, item)}
                        title="Edit?" 
                      />
                    </div>
                  </div>
                );
              }
            })}
          {isCompleteScreen === true &&
            completedTodos.map ((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo (index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
