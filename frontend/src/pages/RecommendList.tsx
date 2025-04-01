import { useState } from 'react';

function RecommendList() {
  const [idType, setIdType] = useState();
  const [idNumber, setIdNumber] = useState();

  return (
    <>
      <input type="radio" id="userID" name="idType" value="userID" />
      <label htmlFor="userID">UserID</label>
      <input type="radio" id="itemID" name="idType" value="itemID" />
      <label htmlFor="itemID">ItemID</label>
      <br />
      <br />
      <label htmlFor="idNumber">Enter ID Number: </label>
      <input type="number" id="idNumber" value={idNumber} />
    </>
  );
}

export default RecommendList;
