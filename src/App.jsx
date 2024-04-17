import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


///Setting state 
function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [card, setCard] = useState(null);
  const [shuffling, setShuffling] = useState(false); 
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const getNewDeck = async () => {
      try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/');
        if (isMounted.current) {
          setDeckId(response.data.deck_id);
          setRemaining(response.data.remaining);
        }
      } catch (error) {
        console.error('Error fetching new deck:', error);
      }
    };

    getNewDeck();
  }, []);

  const drawCard = async () => {
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      if (response.data.success) {
        setCard(response.data.cards[0]);
        setRemaining(response.data.remaining);
      } else {
        alert('Error: no cards remaining!');
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const shuffleDeck = async () => {
    setShuffling(true); // Set shuffling state to true
    setCard(null); // Clear the current card
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      if (response.data.success) {
        setRemaining(response.data.remaining);
      } else {
        alert('Error: Failed to shuffle deck!');
      }
    } catch (error) {
      console.error('Error shuffling deck:', error);
    } finally {
      setShuffling(false); // Set shuffling state back to false after the shuffle process completes
    }
  };

  return (
    <div>
      <h1>Deck of Cards</h1>
      <button onClick={drawCard} disabled={!deckId || shuffling}>
        Draw Card
      </button>
      <button onClick={shuffleDeck} disabled={!deckId || shuffling}>
        {shuffling ? 'Shuffling...' : 'Shuffle Deck'}
      </button>
      {card && (
        <div>
          <img src={card.image} alt={card.code} style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
