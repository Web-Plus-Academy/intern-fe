import React, { useEffect, useState } from 'react'
import axios from '../../axiosConfig';
import { format } from 'date-fns';
import './FinalProject.css'
import Swal from 'sweetalert2';  // Import SweetAlert2

const FinalProject = () => {

    const [semProj, setSemProj] = useState([]);
    const [links, setLinks] = useState({}); // Stores gitlink and livelink for each task


    // Fetch semproj from the backend using Axios
    const fetchSemProj = async () => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const { ID } = userDetails;
        if (!ID) {
            console.error('No internID found in localStorage');
            return;
        }

        axios.post('api/user/getSemProj', { internID: ID }) // Replace with your API endpoint
            .then((response) => {
                setSemProj(response.data)
            })
            .catch((error) => {
                // Show an error alert if the fetch fails
                Swal.fire({
                    icon: 'error',
                    title: 'Error Fetching Data',
                    text: 'There was an issue fetching the task data. Please try again later.',
                });
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        fetchSemProj();
    }, []);

    // ----------submit sem project --------------
    const handleLinkChange = (e, taskId, linkType) => {
        setLinks({
            ...links,
            [taskId]: {
                ...links[taskId],
                [linkType]: e.target.value
            }
        });
    };

    const handleLinkSubmit = async (e, semester, taskId) => {
        e.preventDefault();

        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const { ID } = userDetails;
        if (!ID) {
            console.error('No internID found in localStorage');
            return;
        }

        const { gitlink } = links[taskId] || {};
        const submittedTime = new Date().toISOString();

        const semSub = {
            internID: ID,
            projId: taskId,
            gitLink: gitlink,
            submittedTime,
            semester
        }
        console.log(semSub)
        try {
            const response = await axios.post('/api/user/submitSemProj', semSub);

            console.log(response)


            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Links Submitted Successfully!',
                    text: 'Your GitHub and have been submitted.',
                });
                fetchSemProj(); // Refresh the data
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed!',
                    text: 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Error!',
                text: 'An error occurred while submitting your links. Please try again.',
            });
            console.error('Error submitting links:', error);
        }
    };


    return (
        <div>
            {/* --------sem project------------- */}

            <div className='Final-Project task-submit-container'>


                <h3 className="semester-title">Final Project Submission</h3>
                <hr />
                <br />
                <div >
                    {semProj.length === 0 ? (
                        <p>Final Project will allocate soon...</p>
                    ) : (
                        <div className="task-grid">
                            {semProj.map((task) => (
                                <div key={task._id} className="task-item fp-item">
                                    {/* Formatting Allocated Date */}
                                    <p className="task-details">
                                        <b>Allocated Date:</b>
                                        {format(new Date(task.allocDate), 'dd/MM/yyyy')}  {/* Output: 10/11/2024 */}
                                    </p>

                                    {/* Formatting End Date */}
                                    <p className="task-details">
                                        <b>End Date:</b>
                                        {format(new Date(task.endDate), 'dd/MM/yyyy')}  {/* Output: 10/11/2024 */}
                                    </p>
                                    <p className="task-details"><b>Project Link:</b> <a href={task.link} target="_blank" rel="noopener noreferrer">{"View Task"}</a></p>

                                    {task.isSubmitted ? (
                                        task.credit === -1 ? (
                                            <p className="task-credits"><b>⌛Credit assigning in process...</b></p>
                                        ) : (
                                            <p className="task-credits"><b>Credit Assigned:</b>✅</p>
                                        )
                                    ) : (
                                        <p className="task-credits"><b>Pending credit assignment</b></p>
                                    )}

                                    {/* Input fields for GitHub and Live link submission */}
                                    {!task.isSubmitted ? (


                                        <form className="task-form fp-form" onSubmit={(e) => handleLinkSubmit(e, task.sem, task._id)}>
                                            <label>
                                                GitHub Link:
                                                <input
                                                    type="url"
                                                    value={links[task._id]?.gitlink || ''}
                                                    onChange={(e) => handleLinkChange(e, task._id, 'gitlink')}
                                                    placeholder="Enter your GitHub link"
                                                    required
                                                />
                                            </label>
                                            <br />

                                            <br />
                                            <button type="submit" className="submit-button">Submit Links</button>
                                        </form>

                                    ) : (
                                        <p className="task-submitted">Project already submitted. <br />
                                            Submitted link:
                                            <br />
                                            <a href={task.gitlink} target="_blank" rel="noopener noreferrer">{"Git link"}</a> <br />
                                        </p>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FinalProject
