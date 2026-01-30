"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteAppliance } from "@/actions/appliances";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Appliance } from "@/db/schema";
import { WarrantyBadge } from "./warranty-badge";

interface ApplianceListProps {
  appliances: Appliance[];
  roomId: string;
}

export function ApplianceList({ appliances, roomId }: ApplianceListProps) {
  const [isPending, startTransition] = useTransition();

  if (appliances.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No appliances yet. Add your first appliance to get started.
      </div>
    );
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this appliance?")) {
      startTransition(async () => {
        await deleteAppliance(id, roomId);
      });
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Brand / Model</TableHead>
          <TableHead>Warranty</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appliances.map((appliance) => (
          <TableRow key={appliance.id}>
            <TableCell>
              <div className="font-medium">{appliance.name}</div>
              {appliance.serialNumber && (
                <div className="text-sm text-muted-foreground">
                  S/N: {appliance.serialNumber}
                </div>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {[appliance.brand, appliance.modelNumber]
                .filter(Boolean)
                .join(" - ") || "—"}
            </TableCell>
            <TableCell>
              <WarrantyBadge
                warrantyExpiration={appliance.warrantyExpiration}
              />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/rooms/${roomId}/appliances/${appliance.id}/edit`}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(appliance.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
