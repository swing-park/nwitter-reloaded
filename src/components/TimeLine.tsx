import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./Tweet";

export interface ITweet {
  docId: string;
  tweet: string;
  username: string;
  userId: string;
  photo?: string;
  createdAt: number;
}

const Wrapper = styled.div``;

const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapShot = await getDocs(tweetsQuery);
    const tweetsData = snapShot.docs.map((doc) => {
      const { tweet, username, userId, photo, createdAt } = doc.data();
      return { tweet, username, userId, photo, createdAt, docId: doc.id };
    });
    setTweets(tweetsData);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.docId} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
