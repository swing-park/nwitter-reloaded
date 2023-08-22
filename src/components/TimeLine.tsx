import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./Tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  docId: string;
  tweet: string;
  username: string;
  userId: string;
  photo?: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unSubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unSubscribe = await onSnapshot(tweetsQuery, (snapShot) => {
        const tweetsData = snapShot.docs.map((doc) => {
          const { tweet, username, userId, photo, createdAt } = doc.data();
          return { tweet, username, userId, photo, createdAt, docId: doc.id };
        });

        setTweets(tweetsData);
      });
    };

    fetchTweets();

    return () => {
      unSubscribe && unSubscribe();
    };
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
