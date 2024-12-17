import { Icons, IconsType } from "../Icons";

const SearchResult = ({
  icon: Icon,
  text,
}: {
  icon: IconsType;
  text: string;
}) => (
  <div className="bg-background/80 backdrop-blur-sm rounded-md p-2 text-sm flex items-center hover:bg-background/90 transition-colors cursor-pointer group">
    <Icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    <span className="transition-colors group-hover:text-primary">{text}</span>
  </div>
);

const SearchDemo = () => {
  const searchResults = [
    { icon: Icons.code, text: "Authentication flow implementation" },
    { icon: Icons.database, text: "Database connection setup" },
    { icon: Icons.user, text: "User model and relations" },
    { icon: Icons.api, text: "API endpoint documentation" },
  ];

  return (
    <div className="bg-secondary/30 rounded-lg p-4 backdrop-blur-md">
      <div className="flex items-center mb-4 bg-background/50 rounded-lg p-2 border border-border/50">
        <Icons.search className="mr-2 h-4 w-4 text-primary" />
        <input
          type="text"
          placeholder="Search your repository..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      <div className="space-y-2">
        {searchResults.map((result, index) => (
          <SearchResult key={index} icon={result.icon} text={result.text} />
        ))}
      </div>
    </div>
  );
};

export default SearchDemo;
