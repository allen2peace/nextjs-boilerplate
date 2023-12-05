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
import { error } from 'console';
import Brand from './component/Brand';
import ProductHunt from './component/ProductHunt';
import Search from './component/Search';
import GptsList from './component/GptsList';
import Tab from './component/Tab';



export default function Home() {
  const [gpts, setGpts] = useState<Gpts[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("hot");
  const [gptsCount, setGptsCount] = useState(0);
  const fetchGpts = async (tab: string) => {
    const params = {
      last_id: 0,
      limit: 50,
      tab: tab,
    };

    setLoading(true);
    const resp = await fetch("/api/gpts/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    setLoading(false);

    if (resp.ok) {
      const res = await resp.json();
      if (res.data) {
        setGptsCount(res.data.count);
        setGpts(res.data.rows);
      }
    }
  };
  useEffect(() => {
    fetchGpts(tabValue);
  }, [tabValue]);

  return (
    <section className="relative mt-4 md:mt-8 flex justify-center items-center w-screen h-screen">
      <div className="mx-auto w-full max-w-2xl px-6 text-center overflow-auto h-screen">

        <Brand count={1998} />
        <ProductHunt />
        <Search setGpts={setGpts} setLoading={setLoading}/>
        <Tab tabValue={tabValue} setTabValue={setTabValue} />
        <GptsList gpts={gpts} loading={loading} />
      </div>
    </section>
  );
}
