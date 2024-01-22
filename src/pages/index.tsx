import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/signIn');
  };

  return (
    <div className="min-w-full min-h-screen p-4 md:p-8 flex flex-col justify-center items-center bg-back-brown font-urbanist">
      <div className="images_container flex flex-col justify-center items-center border">
        <div className="row1_container flex flex-row justify-center bg-white m-6">
          <div className="p-6 border border-blue-500">Image 1</div>
          <div className="p-6 border border-blue-500">Image 2</div>
        </div>
        <div className="row2_container flex flex-row justify-center bg-white m-6">
          <div className="p-6 border border-blue-500">Image 3</div>
          <div className="p-6 border border-blue-500">Image 4</div>
        </div>
      </div>
      <div className="brand_name m-10 text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        showcast
      </div>
      <div className="tagline text-white text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl font-bold">
        meet strangers from farcaster
      </div>
      <button
        className="start border-[10px] border-start-border bg-start-bg rounded-[48px] px-[144px] py-4 mt-20"
        onClick={handleStartClick}
      >
        Start
      </button>
    </div>
  );
}
