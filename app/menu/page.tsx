"use client";

import Image from "next/image";
import arrowkeys from "@/public/arrowkeys.svg";
import numberkeys from "@/public/numberbuttons.svg";
import spacebutton from "@/public/spacebutton.svg";
import CubeMover from "@/components/Cube"; // Adjust the import path accordingly

function Page() {
  return (
    <div className="h-screen w-screen bg-black text-white flex items-start justify-start ">
      <div className="flex flex-col items-start gap-16 mt-20 pl-10 pt-10">
        <div className="flex flex-col items-center ml-[130px]">
          <p className="mb-4 text-[30px] font-bold text-center">Move</p>
          <Image src={arrowkeys} width={155} height={155} alt="Arrow Keys" />
        </div>
        <div className="flex flex-col items-center mr-12 ">
          <p className="mb-4 text-[30px] font-bold text-center">Change Color</p>
          <Image
            src={spacebutton}
            width={450}
            height={150}
            alt="Space Button"
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-4 text-[30px] font-bold mr-12 text-center">Speed</p>
          <Image src={numberkeys} width={500} height={150} alt="Number Keys" />
        </div>
      </div>

      <div className=" w-[1500px] h-screen relative overflow-hidden">
        <CubeMover />
      </div>
    </div>
  );
}

export default Page;
