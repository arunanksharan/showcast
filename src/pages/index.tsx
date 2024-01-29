// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/signin');
  };
  return (
    <div className="MacbookPro13 w-[1440px] h-[900px] relative bg-violet-500">
      <div className="Text left-[466px] top-[158px] absolute"></div>
      <div className="Group9 opacity-70 w-[1531.96px] h-[1405.05px] left-[-45.98px] top-[-248.53px] absolute">
        <div className="Group8 w-[1531.96px] h-[1405.05px] left-0 top-0 absolute">
          <div className="Rectangle12 w-[678.43px] h-[741.06px] left-[423.25px] top-[449px] absolute bg-violet-500 rounded-[28.60px] border border-white" />
        </div>
        <div className="Group7 w-[1351.68px] h-[1239.71px] left-[90.14px] top-[82.67px] absolute">
          <div className="Rectangle12 w-[640.40px] h-[699.51px] left-[352.33px] top-[380.54px] absolute bg-violet-500 rounded-[28.60px] border border-white" />
        </div>
        <div className="Group6 w-[1244.04px] h-[1140.99px] left-[143.96px] top-[132.03px] absolute">
          <div className="Rectangle12 w-[589.40px] h-[643.81px] left-[324.27px] top-[350.24px] absolute bg-violet-500 rounded-[28.60px] border border-white" />
        </div>
        <div className="Group5 w-[1147.35px] h-[1052.30px] left-[192.31px] top-[176.37px] absolute">
          <div className="Rectangle12 w-[543.59px] h-[593.77px] left-[299.07px] top-[323.01px] absolute bg-violet-500 rounded-[28.60px] border border-white" />
        </div>
        <div className="Group2 opacity-10 w-[1024.05px] h-[939.22px] left-[253.96px] top-[232.92px] absolute">
          <div className="Rectangle12 w-[485.17px] h-[529.96px] left-[266.93px] top-[288.30px] absolute bg-violet-500 rounded-[28.60px] border border-white" />
          <div className="Ellipse3 w-[209.75px] h-[209.75px] left-[399.51px] top-[420.12px] absolute bg-violet-500 rounded-full border border-white" />
        </div>
        <div className="Group4 w-[1024.05px] h-[939.22px] left-[253.96px] top-[232.92px] absolute">
          <div className="Rectangle12 w-[485.17px] h-[529.96px] left-[266.93px] top-[288.30px] absolute bg-violet-500 rounded-[28.60px] border" />
        </div>
      </div>
      <div className="Frame8 left-[489px] top-[335px] absolute flex-col justify-start items-center gap-[22.28px] inline-flex">
        <div className="Frame4 flex-col justify-start items-center gap-[16.71px] flex">
          <div className="Frame9 flex-col justify-start items-center flex">
            <div className="EveryFaceIsANewStory text-center text-white text-8xl font-black font-['Mona Sans Condensed'] uppercase leading-[86.40px]">
              Every Face is
              <br />a New Story
            </div>
          </div>
          <div className="ExperienceTheJoyOfOneOnOneConversationsWithStrangers w-[329px] text-center text-white text-xl font-medium font-['Manrope']">
            Experience the Joy of One-on-One Conversations with Strangers.
          </div>
        </div>
      </div>
      <div className="Logo w-[202px] h-[40.64px] left-[619.09px] top-[198px] absolute">
        <div className="Group2 w-[44.32px] h-[40.64px] left-0 top-0 absolute">
          <div className="Rectangle12 w-[21px] h-[22.93px] left-[11.55px] top-[12.48px] absolute bg-violet-500 rounded-sm" />
          <div className="Ellipse3 w-[9.08px] h-[9.08px] left-[17.29px] top-[18.18px] absolute bg-white rounded-full" />
        </div>
      </div>
      <div className="Button w-[244px] px-4 py-3 left-[598px] top-[765.14px] absolute rounded-[50px] border border-white justify-center items-center gap-1 inline-flex">
        <div
          className="StartYourStoryNow text-center text-white text-base font-medium font-['Manrope']"
          onClick={handleStartClick}
        >
          Start Your Story Now!
        </div>
        <div className="ArrowRight02Round w-6 h-6 px-1 py-[7px] justify-center items-center flex">
          <div className="Elements origin-top-left rotate-90 w-2.5 h-4 relative"></div>
        </div>
      </div>
    </div>
  );
}
