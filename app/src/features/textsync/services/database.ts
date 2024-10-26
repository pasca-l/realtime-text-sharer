import { get, onValue, ref, remove, set } from "firebase/database";

import { Service } from "./service";

import { DATABASE } from "@/config/firebaseConfig";

const addData = async (roomId: string) => {
  await set(ref(DATABASE, `${roomId}/`), "");
};

const getData = async (
  roomId: string,
  setContent: (content: string) => void
) => {
  const snapshot = await get(ref(DATABASE, `${roomId}/`));
  if (snapshot.exists()) {
    setContent(snapshot.val());
  } else {
    throw new Error(`room ${roomId} doesn't seem to exist...`);
  }
};

const updateData = async (roomId: string, content: string) => {
  const snapshot = await get(ref(DATABASE, `${roomId}/`));
  if (snapshot.exists()) {
    await set(ref(DATABASE, `${roomId}/`), content);
  } else {
    throw new Error(`room ${roomId} doesn't seem to exist...`);
  }
};

const unsubscribeData = (
  roomId: string,
  setContent: (content: string) => void
) => {
  return onValue(ref(DATABASE, `${roomId}/`), (snapshot) => {
    const data = snapshot.val();
    if (data !== null) {
      setContent(data);
    }
  });
};

const deleteData = async (roomId: string) => {
  await remove(ref(DATABASE, `${roomId}/`));
};

export const firebaseService: Service = {
  addData: addData,
  getData: getData,
  updateData: updateData,
  unsubscribeData: unsubscribeData,
  deleteData: deleteData,
};
