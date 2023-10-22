// // ExpertCard.jsx

// import React from 'react';

// const ExpertCard = ({ expert }) => {
//   const { name, categories, price } = expert;

//   return (
//     <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-4 rounded-md shadow-md text-blue-900">
//       <h3 className="text-lg font-semibold mb-2">{name}</h3>
//       <p className="text-opacity-75 mb-2">{categories.join(', ')}</p>
//       <p className="text-opacity-75">{`Price: ${price}`}</p>
//       <div className="mt-4">
//         <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mr-2">
//           Call
//         </button>
//         <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md">
//           Chat
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExpertCard;


// ExpertCard.jsx
// import React from 'react';

// const ExpertCard = ({ expert }) => {
//   const { name, categories, price } = expert;

//   return (
//     <div className="bg-white p-6 rounded-md shadow-md">
//       <h3 className="text-xl font-semibold mb-2 text-gray-800">{name}</h3>
//       <p className="text-gray-600 mb-2">{categories.join(', ')}</p>
//       <p className="text-lg text-blue-500 font-semibold">{`Price: ${price}`}</p>
//       <div className="mt-4 flex justify-between items-center">
//         <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-2">
//           Call
//         </button>
//         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
//           Chat
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExpertCard;



// ExpertCard.jsx
import { ContactSupport } from '@material-ui/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


const ExpertCard = ({ expert,onBookAppointmentClick, userEmail }) => {
  const { username, categories, price, availability, contact } = expert;
  const [isModalOpen, setModalOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  let userId,expertId;
  const location = useLocation();
  const userdata = location.state
  // console.log(userdata)
  const [slots, setSlots] = useState([]);
  
  const handleBookAppointment = async() => {
    // Call the callback function to handle the booking action
    onBookAppointmentClick(expert);
    setModalOpen(true);
    // const userId = props.userId;

  // Extract expertId from expert object
  expertId = expert._id;
    console.log(expertId)
    console.log(userEmail)

    try {
      const response = await axios.get(`http://localhost:5000/getUserData?email=${userEmail}`);
      // setUserData(response.data);
     const userData = response.data;
     if (userData.length > 0 && userData[0]._id) {
      userId = userData[0]._id;
      console.log('User ID:', userId);
  
      // Now you have the userId, and you can proceed to create the appointment with this userId.
    } else {
      console.error('User data does not contain userId.');
      // Handle the case where userId is not available in the response
    }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle the error appropriately
    }
  };
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  
  const generateSlots = (availability, bookedSlots = []) => {
    const slots = [];
  
    console.log('Availability:', availability); // Add this line
  
    // Check if availability is not empty and is a string
    if (availability && typeof availability === 'string') {
      // Split the availability string by ' - ' and trim to remove extra spaces
      const [startTime, endTime] = availability.split('-').map(time => time.trim());
  
      // console.log('StartTime:', startTime); // Add this line
      // console.log('EndTime:', endTime); // Add this line
  
      // Check if both start and end times are defined
      if (startTime && endTime) {
        // Extract the start and end hours
        const startHour = parseInt(startTime.split(':')[0], 10);
        const endHour = parseInt(endTime.split(':')[0], 10);
  
        // Define the current date
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.toLocaleString('en-US', { month: 'long' });
        const day = currentDate.getDate();
        const formattedDate = `${month} ${day}, ${year}`;
  
        for (let hour = startHour; hour < endHour; hour++) {
          console.log('Entering the loop for hour', hour);

          const currentHourLabel = hour >= 12 ? 'PM' : 'AM';
          const slot = `${formattedDate}, ${hour % 12 || 12}:00 ${currentHourLabel} - ${(hour + 1) % 12 || 12}:00 ${currentHourLabel}`;
          // Check if the slot is not in the list of bookedSlots
          if (!bookedSlots.includes(slot)) {
            slots.push(slot);
          }
        }
      } else {
        console.error('Invalid availability format:', availability);
      }
    } else {
      console.error('Invalid availability format:', availability);
    }
  
    console.log('Generated Slots:', slots); // Add this line
  
    return slots;
  };
  

  useEffect(() => {
    console.log('Expert Availability:', expert.availability);
  
    // Generate slots based on expert's availability
    if (expert.availability) {
      const slots = generateSlots(expert.availability);
      console.log('Available Slots:', slots);
      setSlots(slots);
    }
  }, [expert.availability]); 
  
  
  // const bookedSlots = [];

// Call generateSlots to get the available slots
const availableSlots = generateSlots(availability, bookedSlots);
// console.log(availableSlots)
  
 
  // useEffect(() => {
  //   // Generate slots based on expert's availability
  //   setSlots(generateSlots(expert.availability));
  // }, [expert.availability]);
  console.log(userId)
  console.log(expertId)
  // console.log(appointmentSlot)
  const bookAppointment = async (userId, expertId, appointmentSlot) => {
    e.preventDefault(); 
    try {
      console.log(userId)
console.log(expertId)
console.log(appointmentSlot)
      const response = await axios.post('http://localhost:5000/book-appointment', {
        userId,
        expertId,
        appointmentSlot,
      });
      console.log(response.data.message);

      updateAppointmentStatus();

      // After booking, you can handle any necessary updates
      // For example, refreshing the list of available slots, etc.
    } catch (error) {
      console.error(error);
    }
  };

  const updateAppointmentStatus = async () => {
    try {
      for (const slot of bookedSlots) {
        const [slotDate, slotTime] = slot.split(', ');
        const slotDateTime = new Date(slotDate + ' ' + slotTime);
        const currentDateTime = new Date();
    
        if (slotDateTime <= currentDateTime) {
          const response = await axios.post('http://localhost:5000/update-appointment-status', {
            slot,
          });
  
          // Update the local bookedSlots array
          const updatedBookedSlots = bookedSlots.filter(bookedSlot => bookedSlot !== slot);
          setBookedSlots(updatedBookedSlots);
          
          console.log(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div className="bg-blue-100 p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-blue-800">{username}</h3>
      <p className="text-gray-600 mb-2">{categories}</p>
      <p className="text-lg text-blue-500 font-semibold">{`Price: ${price}`}</p>
      <p className="text-gray-600 mt-2">{`Availability: ${availability}`}</p>
      <p className="text-gray-600 mt-2">{`Contact: ${contact}`}</p>
      
      <div className="mt-4 flex justify-center items-center">
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md"
          onClick={handleBookAppointment}
        >
          Book Appointment
        </button>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="bg-black opacity-50 fixed "></div>
    <div className="modal bg-white p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">{`Book an appointment with ${username}`}</h2>
      
      {/* Display available slots */}
      <div className="mb-4">
        <p className="text-lg font-semibold mb-2">Available Slots:</p>
        {/* Add logic to display available slots here */}
        <ul>
          <li>Slot 1: October 25, 2023, 10:00 AM - 11:00 AM</li>
          <li>Slot 2: October 26, 2023, 2:00 PM - 3:00 PM</li>
          {/* Add more slots as needed */}
        </ul>
      </div>

      {/* Display pricing for call and chat */}
      <div className="mb-4">
        <p className="text-lg font-semibold mb-2">Pricing:</p>
        <p>Call: $20 per 30 minutes</p>
        <p>Chat: $10 per 30 minutes</p>
        {/* Add more pricing information as needed */}
      </div>

      {/* Form to book a slot */}
      <form  onSubmit={()=>bookAppointment(userId, expertId, selectedSlot)}>
        <div className="mb-4">
          <label htmlFor="selectedSlot" className="block text-sm font-medium text-gray-700">
            Select a Slot:
          </label>
          <select id="selectedSlot" name="selectedSlot" className="mt-1 p-2 border rounded-md">
      <option value="" disabled>
        Select a Slot
      </option>
      {availableSlots.map((slot, index) => ( // Change 'slots' to 'availableSlots'
        <option key={index} value={slot}>
          {slot}
        </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        
        {/* Add other form fields if needed */}
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
         
        >
          Book Slot
        </button>
      </form>

      {/* Add other options like additional services, etc. */}
      
      <button
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mt-2"
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ExpertCard;

// const ExpertList = () => {
//   const [experts, setExperts] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get('http://localhost:5000/api/experts'); // Replace with the actual URL of your backend API
//         setExperts(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//         // Handle error here
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {experts.map((expert) => (
//         <ExpertCard key={expert._id} expert={expert} />
//       ))}
//     </div>
//   );
// };


