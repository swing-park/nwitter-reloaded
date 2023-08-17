import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.input`
  background-color: #1d9bf0;
  padding: 10px 0px;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostTweetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) setFile(files[0]);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonoymous",
        userId: user.uid,
      });

      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );

        const ret = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(ret.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTweet("");
      setFile(null);
    }
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        placeholder="What is happening?"
        value={tweet}
        onChange={handleOnChange}
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added ✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        type="file"
        id="file"
        accept="image/*"
        onChange={handleOnFileChange}
      />
      <SubmitButton
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
};

export default PostTweetForm;
