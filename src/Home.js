import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookNowModal from './BookNowModal';
import tripsData from './data.json'



function Home() {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const bookTrip = (selectedTrip, attendeeName) => {
      const updatedTrips = trips.map((trip) => {
        if (trip.id === selectedTrip.id) {
          return {
            ...trip,
            slots: trip.slots - 1,
            attendees: [...trip.attendees, attendeeName],
          };
        }
        return trip;
      });
      setTrips(updatedTrips);
    };
    

    const handleBookNowClick = (trip) => {
      setSelectedTrip(trip);
      setShowModal(true);
    }

    const handleSearchQueryChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const filteredTrips = trips.filter((trip) => {
      const regex = new RegExp(searchQuery, 'i');
      return regex.test(trip.title) || regex.test(trip.description);
    });
      
    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
          setTrips(tripsData.trips)
          setIsLoading(false);
        }, 1000)
      }, []);

    return (
        <div className="container">
          <BookNowModal show={showModal} onHide={() => setShowModal(false)} onSubmit={(name) => {  
            bookTrip(selectedTrip, name)
            setShowModal(false)
          }} />
          <h1 className="text-center">List of Trips</h1>
          <div className="row mb-3">
            <div className="col-md-6 offset-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by trip name or description"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
            </div>
          </div>

          <div className="row">
            {isLoading ? (
              <div className="text-center">
                <i className="fa fa-spinner fa-spin fa-3x" />
              </div>
            ) : (
              <div className="col-md-12">
                {filteredTrips.length > 0 ? (
                  <div className="row">
                    {filteredTrips.map((trip) => (
                      <div key={trip.id} className="col-md-6 mb-4">
                        <div className="card mb-4 box-shadow">
                          <div className="card-body">
                            <h2>{trip.title}</h2>
                            <p className="card-text">{trip.description}</p>
                            <p className="card-text">Date: {trip.date}</p>
                            <p className="card-text">Slots: {trip.slots}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="btn-group">
                                {trip.slots === 0 ? (
                                  <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                                    Sold out
                                  </button>
                                ) : (
                                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleBookNowClick(trip)}>
                                    Book now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <h2>No results found</h2>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
}

export default Home;

        
