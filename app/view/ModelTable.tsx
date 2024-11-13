import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, Model } from "@/types/schema";
import { Database, Key, KeyRound, List } from "lucide-react";

interface ModelTableProps {
  model: Model;
}

const FieldRow = ({ field }: { field: Field }) => {
  const getFieldIcon = () => {
    if (field.isPrimaryKey) return <Key className="h-4 w-4 text-yellow-500" />;
    if (field.isForeignKey)
      return <KeyRound className="h-4 w-4 text-blue-500" />;
    if (field.isList) return <List className="h-4 w-4 text-purple-500" />;
    return null;
  };

  return (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded-sm group">
      <div className="w-5">{getFieldIcon()}</div>
      <div className="flex-1 font-mono text-sm">
        {field.name}
        {!field.isRequired && "?"}
      </div>
      {field.isUnique && (
        <Badge variant="outline" className="h-5">
          unique
        </Badge>
      )}
      <div className="font-mono text-sm text-muted-foreground">
        {field.isList ? `${field.type}[]` : field.type}
      </div>
    </div>
  );
};

export function ModelTable({ model }: ModelTableProps) {
  return (
    <Card className="w-[300px] shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <CardTitle className="text-lg">{model.name}</CardTitle>
        </div>
        {model.tableName && (
          <CardDescription className="font-mono text-xs">
            {model.tableName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-1">
        {model.fields.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
        {model.uniqueConstraints && model.uniqueConstraints.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Unique Constraints
            </div>
            {model.uniqueConstraints.map((constraint, i) => (
              <div
                key={i}
                className="text-xs font-mono px-2 py-1 bg-muted rounded-sm"
              >
                [{constraint.join(", ")}]
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
