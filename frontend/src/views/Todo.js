import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

function Todo() {
    const baseUrl = "http://127.0.0.1:8000/api";
    const api = useAxios();

    // Get user ID from JWT token
    const token = localStorage.getItem("authTokens");
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    // State for todos
    const [todo, setTodo] = useState([]);
    
    useEffect(() => {
        fetchTodos();
    }, [user_id]); // Dependency added to prevent stale user_id

    const fetchTodos = async () => {
        try {
            const res = await api.get(`${baseUrl}/todo/${user_id}/`);
            setTodo(res.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    // State for new todo
    const [createTodo, setCreateTodo] = useState({ title: "", completed: false });

    const handleNewTodoTitle = (event) => {
        setCreateTodo({ ...createTodo, [event.target.name]: event.target.value });
    };

    // Add new todo
    const formSubmit = async () => {
        try {
            const formdata = new FormData();
            formdata.append("user", user_id);
            formdata.append("title", createTodo.title);
            formdata.append("completed", false);

            const res = await api.post(`${baseUrl}/todo/${user_id}/`, formdata);
            
            setTodo([...todo, res.data]); // Optimistically update UI
            setCreateTodo({ title: "", completed: false });

            Swal.fire({
                title: "Todo Added",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Delete todo
    const deleteTodo = async (todo_id) => {
        try {
            await api.delete(`${baseUrl}/todo-detail/${user_id}/${todo_id}/`);
            setTodo(todo.filter(item => item.id !== todo_id)); // Remove item from state
            
            Swal.fire({
                title: "Todo Deleted",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    // Mark todo as complete
    const markTodoAsComplete = async (todo_id) => {
        try {
            await api.patch(`${baseUrl}/todo-mark-as-completed/${user_id}/${todo_id}/`);
            setTodo(todo.map(item => 
                item.id === todo_id ? { ...item, completed: true } : item
            )); // Update completed status in state
            
            Swal.fire({
                title: "Todo Completed",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Error marking todo as complete:", error);
        }
    };

    return (
        <div>
            <div className="container" style={{ marginTop: "150px", padding: "10px" }}>
                <div className="row justify-content-center align-items-center main-row">
                    <div className="col shadow main-col bg-white">
                        <div className="row bg-primary text-white">
                            <div className="col p-2">
                                <h4>Desphixs Todo App</h4>
                            </div>
                        </div>

                        <div className="row justify-content-between text-white p-2">
                            <div className="form-group flex-fill mb-2">
                                <input
                                    id="todo-input"
                                    name='title'
                                    onChange={handleNewTodoTitle}
                                    value={createTodo.title}
                                    type="text"
                                    className="form-control"
                                    placeholder='Write a todo...'
                                />
                            </div>
                            <button type="button" onClick={formSubmit} className="btn btn-primary mb-2 ml-2">
                                Add todo
                            </button>
                        </div>

                        <div className="row" id="todo-container">
                            {todo.map((item) => (
                                <div key={item.id} className="col col-12 p-2 todo-item">
                                    <div className="input-group">
                                        <p className="form-control">
                                            {item.completed ? <strike>{item.title}</strike> : item.title}
                                        </p>
                                        <div className="input-group-append">
                                            {!item.completed && (
                                                <button
                                                    className="btn bg-success text-white ml-2"
                                                    type="button"
                                                    onClick={() => markTodoAsComplete(item.id)}
                                                >
                                                    <i className='fas fa-check'></i>
                                                </button>
                                            )}
                                            <button
                                                className="btn bg-danger text-white ml-2"
                                                type="button"
                                                onClick={() => deleteTodo(item.id)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
