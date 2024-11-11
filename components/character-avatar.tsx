import React from "react";

interface CharacterAvatarProps {
  username: string;
  size?: number;
}

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

const textColors = ["text-white", "text-gray-100", "text-gray-200"];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function CharacterAvatar({ username, size = 40 }: CharacterAvatarProps) {
  const hash = hashCode(username);
  const backgroundColorClass = colors[hash % colors.length];
  const textColorClass = textColors[hash % textColors.length];
  const character = username.charAt(0).toUpperCase();

  return (
    <div
      className={`rounded-full flex items-center justify-center border-2 border-white ${backgroundColorClass}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span
        className={`text-${Math.floor(
          size / 2
        )}px font-semibold ${textColorClass}`}
      >
        {character}
      </span>
    </div>
  );
}
