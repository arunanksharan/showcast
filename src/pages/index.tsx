// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from "../../styles/Hero.module.css"

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/signin');
  };
  return (
    <>
      <div className="relative min-w-full min-h-screen flex flex-col items-center justify-center m-0 p-0">
        <Image
          src="/hero/Group 9.svg"
          layout="fill"
          objectFit="cover"
          alt="Hero Image"
          priority
          className="bg-hero-bg absolute w-full h-full"
        />
        <div className="HeroContentContainer relative bottom-10 inline-flex font-urbanist text-white">
          <div className="flex flex-col justify-between items-center">
            <Image
              src="/logo.svg"
              alt="showcast logo"
              width={202}
              height={41}
              className="mb-20"
            />
            <div className={`text-6xl mt-10 font-mona font-black uppercase text-center ${styles.heroTitle}`}>
              EVERY FACE IS<br></br>A NEW STORY
            </div>
            <div className="text-xl mt-10 font-manrope text-center font-medium">
              Experience the Joy of One-on-One
              <br />
              Conversations with Strangers.
            </div>

            <div
              className="bg-transparent border-0.5 border-solid border-white text-white font-manrope py-2 px-8 rounded-full flex items-center justify-center hover:bg-white hover:text-purple-700 transition-all mt-20 cursor-pointer"
              onClick={handleStartClick}
            >
              Start Your Story Now
              <svg
                className="ml-2 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
