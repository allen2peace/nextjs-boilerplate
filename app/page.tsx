"use client";
import Image from 'next/image'
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { Gpts } from "@/app/gpts";


interface Props {
  setGpts: Dispatch<SetStateAction<Gpts[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default () => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState("");
  const [info, setInfo] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit(content);
      }
    }
  };

  const handleSubmit = async (content: string) => {
    try {

      let [name, suffix] = content.split(".")
      const uri = `https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`;
      console.log(uri);
      // const params = {
      //   keyword: keyword,
      //   question: question,
      // };

      console.log('start fetch');
      // setLoading(true);
      const resp = await fetch(uri, {
        method: "GET",
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Credentials': 'true'
        // }
      });
      // resp.headers.set('Access-Control-Allow-Origin', '*');
      // setLoading(false);
      console.log(resp);
      if (resp.ok) {
        const res = await resp.json();
        // console.log(res);
        console.log(res.info);
        if (res.info) {
          setInfo(res.info);
        }
      }
    } catch (e) {
      console.log("search failed: ", e);
    }
  };

  // useEffect(() => {
  //   if (content) {
  //     handleSubmit(content, "");
  //   }
  // }, [content]);

  return (
    <section className="relative mt-4 md:mt-8 flex justify-center items-center w-screen h-screen">
    <div className="mx-auto w-full max-w-2xl px-6 text-center overflow-auto h-screen">
        <div className="flex items-center relative ">
          <input
            type="text"
            className="flex-1 px-4 py-3 border-2 border-primary bg-white rounded-lg"
            placeholder="keyword or prompt for searching GPTs"
            ref={inputRef}
            value={content}
            disabled={inputDisabled}
            onChange={handleInputChange}
            onKeyDown={handleInputKeydown}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-4 cursor-pointer"
            onClick={() => {
              if (content) {
                handleSubmit(content);
              }
            }}
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        </div>
        {/* console.log({info}); */}
        {info  && (
        <div className="items-center font-mono text-sm flex items-center relative mt-10 justify-center">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30" style={{ whiteSpace: 'pre-line' }}>
            {/* {content}的详细信息如下： */}
            {info}
          </p>
        </div>
      )}
      </div>
    </section>
  );
}
