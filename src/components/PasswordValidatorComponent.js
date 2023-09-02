import React, { useEffect, useState } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import zxcvbn from 'zxcvbn';
  
const PasswordValidatorComponent = ({ password }) => {
  const [score, setScore] = useState(0); 
  const passwordScore = zxcvbn(password).score;
  
  useEffect(() => {
    setScore(passwordScore);
  }, [passwordScore]);

  return (
    <div>
      {score < 2 && (
        <div>
          <ul className='list-error'>
            {zxcvbn(password).feedback.suggestions.map((suggestion) => (
              <li className='item-error' key={suggestion}><RiCloseCircleFill /> {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordValidatorComponent;