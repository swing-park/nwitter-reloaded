import styled from "styled-components";
import { ITweet } from "./TimeLine";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const UserName = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DelButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Tweet = ({ username, photo, tweet, userId, docId }: ITweet) => {
  const user = auth.currentUser;

  const handleOnDelete = async () => {
    const isConfirm = confirm("Are you sure you want to delete this tweet?");

    if (!isConfirm || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", docId));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${docId}`);
        await deleteObject(photoRef);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: edit tweet for mine, del edit photo,
  return (
    <Wrapper>
      <Column>
        <UserName>{username}</UserName>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DelButton onClick={handleOnDelete}>Delete</DelButton>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
};

export default Tweet;
