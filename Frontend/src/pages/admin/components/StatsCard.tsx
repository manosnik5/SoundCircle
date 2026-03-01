import { Card, CardContent } from "@/components/ui/card";


interface StatsCardProps {
    label: string; 
		icon: React.ElementType;
    value: string;
    bgColor: string;
    iconColor: string;

}

const StatsCard = ({label, icon: Icon, value, bgColor, iconColor}: StatsCardProps) => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className={`${iconColor} size-6`}/>
          </div>
        </div>
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-2xl font-bold text-amber-50">{value}</p>
        </div> 
      </CardContent>
    </Card>
  )
}

export default StatsCard