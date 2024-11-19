import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await searchGithub();
      setCandidates(data);
      setCurrentCandidate(data[0] || null);
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  const handleSaveCandidate = () => {
    if (currentCandidate) {
      setSavedCandidates([...savedCandidates, currentCandidate]);
      showNextCandidate();
    }
  };

  const showNextCandidate = () => {
    const nextCandidates = candidates.slice(1);
    setCandidates(nextCandidates);
    setCurrentCandidate(nextCandidates[0] || null);
  };

  return (
    <section>
      {currentCandidate ? (
        <>
          <img src={currentCandidate.avatar_url} alt={`${currentCandidate.name}'s avatar`} />
          <h1>{currentCandidate.name}</h1>
          <p>Username: {currentCandidate.login}</p>
          <p>Location: {currentCandidate.location}</p>
          <p>Email: {currentCandidate.email}</p>
          <p>Company: {currentCandidate.company}</p>
          <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
            GitHub Profile
          </a>
          <div>
            <button onClick={handleSaveCandidate}>Potential Candidate</button>
            <button onClick={showNextCandidate}>Skip</button>
          </div>
        </>
      ) : (
        <h1>No more candidates available</h1>
      )}
    </section>
  );
};

export default CandidateSearch;