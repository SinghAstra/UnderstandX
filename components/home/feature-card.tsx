import { Icons, IconsType } from "../Icons";

const FeatureCard = ({
  icon: Icon,
  title,
  gradient,
}: {
  icon: IconsType;
  title: string;
  gradient: string;
}) => (
  <div
    className={`rounded-lg p-3 text-center ${gradient} transition-transform hover:scale-105`}
  >
    <Icon className="mx-auto mb-2 h-6 w-6 text-white" />
    <span className="text-xs font-medium text-white">{title}</span>
  </div>
);

const FeatureGrid = () => {
  const features = [
    {
      icon: Icons.search,
      title: "Semantic Search",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: Icons.gitLogo,
      title: "Repo Analysis",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      icon: Icons.brainCircuit,
      title: "AI Insights",
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeatureGrid;
