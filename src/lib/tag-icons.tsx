import * as LucideIcons from "lucide-react";
import { Tag } from "@/types";

export const TAG_ICONS: Array<{
  key: string;
  emoji: string;
  name: string;
  color: string;
  iconName: string;
}> = [
  { key: "scuola", emoji: "🏫", name: "Scuola", color: "text-blue-500", iconName: "GraduationCap" },
  { key: "lavoro", emoji: "💼", name: "Lavoro", color: "text-gray-600", iconName: "Briefcase" },
  { key: "mare", emoji: "🌊", name: "Mare", color: "text-cyan-500", iconName: "Waves" },
  { key: "montagna", emoji: "🏔️", name: "Montagna", color: "text-green-600", iconName: "Mountain" },
  { key: "famiglia", emoji: "👨‍👩‍👧‍👦", name: "Famiglia", color: "text-amber-600", iconName: "Users" },
  { key: "amicizia", emoji: "🤝", name: "Amicizia", color: "text-purple-500", iconName: "Handshake" },
  { key: "feste", emoji: "🎉", name: "Feste", color: "text-pink-500", iconName: "PartyPopper" },
  { key: "carnevale", emoji: "🎭", name: "Carnevale", color: "text-violet-500", iconName: "VenetianMask" },
  { key: "halloween", emoji: "👻", name: "Halloween", color: "text-orange-500", iconName: "Ghost" },
  { key: "viaggi", emoji: "✈️", name: "Viaggi", color: "text-sky-500", iconName: "Plane" },
  { key: "vacanze", emoji: "🌴", name: "Vacanze", color: "text-teal-500", iconName: "Palmtree" },
  { key: "parenti", emoji: "👨‍👩‍👧", name: "Parenti", color: "text-rose-500", iconName: "User" },
  { key: "musica", emoji: "🎵", name: "Musica", color: "text-fuchsia-500", iconName: "Music" },
  { key: "momenti", emoji: "☕", name: "Momenti", color: "text-amber-700", iconName: "Coffee" },
  { key: "gioia", emoji: "❤️", name: "Gioia", color: "text-red-500", iconName: "Heart" },
  { key: "felicita", emoji: "😊", name: "Felicità", color: "text-yellow-500", iconName: "Smile" },
  { key: "amore", emoji: "💝", name: "Amore", color: "text-pink-500", iconName: "HeartHandshake" },
  { key: "serenita", emoji: "✨", name: "Serenità", color: "text-cyan-500", iconName: "Sparkles" },
  { key: "festa", emoji: "🎊", name: "Festa", color: "text-purple-500", iconName: "PartyPopper" },
  { key: "allegria", emoji: "😀", name: "Allegria", color: "text-pink-400", iconName: "Smile" },
  { key: "luce", emoji: "☀️", name: "Luce", color: "text-amber-500", iconName: "Sun" },
  { key: "malinconia", emoji: "🌧️", name: "Malinconia", color: "text-blue-400", iconName: "CloudRain" },
  { key: "tristezza", emoji: "😢", name: "Tristezza", color: "text-gray-500", iconName: "Cloud" },
  { key: "delusione", emoji: "💔", name: "Delusione", color: "text-red-400", iconName: "HeartCrack" },
  { key: "rabbia", emoji: "💨", name: "Rabbia", color: "text-orange-400", iconName: "Wind" },
  { key: "paura", emoji: "⚡", name: "Paura", color: "text-yellow-400", iconName: "Zap" },
  { key: "meraviglia", emoji: "👁️", name: "Meraviglia", color: "text-indigo-400", iconName: "Eye" },
  { key: "ricordo", emoji: "📸", name: "Ricordo", color: "text-teal-400", iconName: "Camera" },
  { key: "compleanno", emoji: "🎂", name: "Compleanno", color: "text-red-400", iconName: "Cake" },
  { key: "regalo", emoji: "🎁", name: "Regalo", color: "text-pink-400", iconName: "Gift" },
  { key: "commemorazione", emoji: "🔥", name: "Commemorazione", color: "text-amber-600", iconName: "Flame" },
  { key: "tempo", emoji: "⏰", name: "Tempo", color: "text-slate-500", iconName: "Clock" },
  { key: "natura", emoji: "🌲", name: "Natura", color: "text-green-500", iconName: "TreePine" },
  { key: "primavera", emoji: "🌸", name: "Primavera", color: "text-pink-300", iconName: "Flower2" },
  { key: "estate", emoji: "🌞", name: "Estate", color: "text-orange-500", iconName: "SunMedium" },
  { key: "autunno", emoji: "🍂", name: "Autunno", color: "text-amber-600", iconName: "Leaf" },
  { key: "inverno", emoji: "❄️", name: "Inverno", color: "text-blue-300", iconName: "Snowflake" },
  { key: "alba", emoji: "🌅", name: "Alba", color: "text-orange-400", iconName: "Sunrise" },
  { key: "tramonto", emoji: "🌇", name: "Tramonto", color: "text-red-300", iconName: "Sunset" },
  { key: "notte", emoji: "🌙", name: "Notte", color: "text-indigo-500", iconName: "Moon" },
  { key: "stelle", emoji: "⭐", name: "Stelle", color: "text-yellow-400", iconName: "Star" },
  { key: "arcobaleno", emoji: "🌈", name: "Arcobaleno", color: "text-pink-300", iconName: "Rainbow" },
  { key: "infanzia", emoji: "👶", name: "Infanzia", color: "text-amber-400", iconName: "Baby" },
  { key: "giovinezza", emoji: "👦", name: "Giovinezza", color: "text-blue-400", iconName: "User" },
  { key: "adulta", emoji: "👩", name: "Adulta", color: "text-slate-600", iconName: "Briefcase" },
  { key: "laurea", emoji: "🎓", name: "Laurea", color: "text-indigo-500", iconName: "GraduationCap" },
  { key: "matrimonio", emoji: "💒", name: "Matrimonio", color: "text-pink-500", iconName: "HeartPulse" },
  { key: "casa", emoji: "🏠", name: "Casa", color: "text-amber-600", iconName: "Home" },
  { key: "sport", emoji: "⚽", name: "Sport", color: "text-green-500", iconName: "Flag" },
  { key: "cibo", emoji: "🍕", name: "Cibo", color: "text-orange-500", iconName: "Utensils" },
  { key: "libri", emoji: "📚", name: "Libri", color: "text-blue-600", iconName: "BookOpen" },
  { key: "film", emoji: "🎬", name: "Film", color: "text-purple-600", iconName: "Clapperboard" },
  { key: "default", emoji: "🏷️", name: "Altro", color: "text-brand-accent", iconName: "Tag" },
];

const iconCache: Record<string, React.ComponentType<{ className?: string }>> = {};

export function getTagIconInfo(tagNameOrEmoji: string): {
  emoji: string;
  iconName: string;
  color: string;
} {
  const normalizedName = tagNameOrEmoji.toLowerCase().trim();
  
  const found = TAG_ICONS.find(
    (t) => t.key === normalizedName || t.name.toLowerCase() === normalizedName || t.emoji === tagNameOrEmoji
  );
  
  if (found) {
    return { emoji: found.emoji, iconName: found.iconName, color: found.color };
  }
  
  return { emoji: "🏷️", iconName: "Tag", color: "text-brand-accent" };
}

export function getLucideIcon(iconName: string): React.ComponentType<{ className?: string }> {
  if (iconCache[iconName]) {
    return iconCache[iconName];
  }
  
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  if (Icon) {
    iconCache[iconName] = Icon;
    return Icon;
  }
  
  return LucideIcons.Tag;
}

export function TagBadge({ tag, showIcon = true }: { tag: Tag; showIcon?: boolean }) {
  const { emoji, iconName, color } = getTagIconInfo(tag.icon || tag.name);
  const Icon = getLucideIcon(iconName);
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-accent/10 rounded-full text-xs">
      {showIcon && <Icon className={`w-3 h-3 ${color}`} />}
      <span>{emoji}</span>
      <span className="text-brand-text">{tag.name}</span>
    </span>
  );
}

export function TagBadgeSimple({ tag }: { tag: Tag }) {
  const { emoji } = getTagIconInfo(tag.icon || tag.name);
  
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span>{emoji}</span>
      <span>{tag.name}</span>
    </span>
  );
}

export const EMOJI_OPTIONS = TAG_ICONS.map((t) => t.emoji);

export function getEmojiIconName(emoji: string): string {
  const found = TAG_ICONS.find((t) => t.emoji === emoji);
  return found ? found.iconName : "Tag";
}
