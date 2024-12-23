import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableSkeleton = () => {
  return (
    <div className="mt-8 rounded-lg border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-accent/5">
            <TableHead className="font-semibold text-center">
              Repository
            </TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold text-center">
              Last Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-accent/5">
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-md mr-4" />
                    <Skeleton className="h-4 w-24 mr-2" />
                    <span className="mx-1 text-muted-foreground">/</span>
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
