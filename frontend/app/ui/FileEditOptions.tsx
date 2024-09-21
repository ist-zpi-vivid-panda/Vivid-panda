'use client'

import { FaScissors } from "react-icons/fa6";
import { FaPaintbrush } from "react-icons/fa6";
import { FaWandSparkles } from "react-icons/fa6";
import { FaBucket } from "react-icons/fa6";
import { FaSun } from "react-icons/fa6";
import { GiResize } from "react-icons/gi";
import { LuEraser } from "react-icons/lu";
import { IoText } from "react-icons/io5";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { IoIosColorFilter } from "react-icons/io";

export const fileEditListOptions = () => {
return (
    <div>
    <p>Scissors</p><FaScissors />
    <p>Brush</p><FaPaintbrush />
    <p>Wand</p><FaWandSparkles />
    <p>Bucket</p><FaBucket />
    <p>Change brightness</p><FaSun />
    <p>Resize</p><GiResize />
    <p>Eraser</p><LuEraser />
    <p>Text</p><IoText />
    <p>Change color</p><IoIosColorPalette />
    <p>Rotate</p><FaArrowRotateRight />
    <p>Add filter</p><IoIosColorFilter />
    </div>
)};