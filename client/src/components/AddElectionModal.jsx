import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { uiActions } from "../pages/store/ui-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddElectionModal = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null); // Changed to null for better validation

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const closeModal = () => {
        dispatch(uiActions.closeElectionModal());
    };

    const token = useSelector(state => state?.vote?.currentVoter?.token);

    const createElection = async (e) => {
        e.preventDefault();
        
        // Validation: If thumbnail is missing, backend req.files.thumbnail will be undefined and crash (500)
        if (!title || !description || !thumbnail) {
            alert("Please fill all fields and select a thumbnail image.");
            return;
        }

        try {
            const electionData = new FormData();
            electionData.append("title", title); // Using append is more standard for files
            electionData.append("description", description);
            electionData.append("thumbnail", thumbnail);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/elections`, electionData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Note: Do NOT manually set Content-Type here; 
                    // Axios/Browser sets it automatically with the correct 'boundary'
                }
            });

            if (response.status === 200 || response.status === 201) {
                closeModal();
                navigate(0); // Refresh to see new data
            }
        } catch (error) {
            // Logs detailed error from backend to help you debug
            console.error("Upload Error:", error.response?.data || error.message);
        }
    };

    return (
        <section className="modal">
            <div className="modal__content">
                <header className="modal__header">
                    <h4>Create New Election</h4>
                    <button className="modal__close" onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </header>

                <form onSubmit={createElection}>
                    <div>
                        <h6>Election Title:</h6>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            name="title" 
                            required 
                        />
                    </div>
                    <div>
                        <h6>Election Description:</h6>
                        <input 
                            type="text" 
                            value={description} 
                            name="description" 
                            onChange={e => setDescription(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <h6>Election Thumbnail:</h6>
                        <input 
                            type="file" 
                            name="thumbnail" 
                            onChange={e => setThumbnail(e.target.files[0])}
                            accept=".png, .jpg, .jpeg, .webp, .avif" // Added dots for correct format
                            required
                        />
                    </div>

                    <button type="submit" className="btn primary">
                        Add Election
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddElectionModal;