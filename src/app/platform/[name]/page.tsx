import InfiniteGrid from "@/components/InfiniteGrid";

const platforms: Record<string, { id: string, name: string, logo: string, logoClass: string }> = {
  netflix: { 
    id: '8', 
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    logoClass: 'h-16 md:h-24 w-auto object-contain'
  },
  prime: { 
    id: '9', 
    name: 'Amazon Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    logoClass: 'h-12 md:h-20 w-auto object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]'
  },
  apple: { 
    id: '350', 
    name: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
    logoClass: 'h-16 md:h-24 w-auto object-contain brightness-0 invert'
  },
  disney: { 
    id: '337', 
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    logoClass: 'h-20 md:h-32 w-auto object-contain brightness-0 invert'
  }
};

export default async function PlatformPage({ params }: { params: { name: string } }) {
  const { name } = await params;
  const platform = platforms[name];
  
  if (!platform) {
    return <div className="pt-24 text-center text-white">Platform not found</div>;
  }

  return (
    <div className="pt-24 min-h-screen bg-black flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-12 mb-8 mt-4 flex flex-col items-center text-center">
        <div className="mb-6">
          <img src={platform.logo} alt={platform.name} className={platform.logoClass} />
        </div>
        <p className="text-gray-400 mt-2 text-lg md:text-xl font-medium tracking-wide">
          Discover popular movies and shows
        </p>
      </div>
      
      {/* Dynamic Infinite Scroll Grid tailored to this platform */}
      <div className="w-full">
        <InfiniteGrid defaultPlatform={platform.id} />
      </div>
    </div>
  );
}
