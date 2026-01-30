"use client";

import {
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteManual } from "@/actions/manuals";
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
import type { Manual } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { formatFileSize } from "@/lib/format";

interface ManualListProps {
  manuals: Manual[];
  roomId: string;
}

export function ManualList({ manuals, roomId }: ManualListProps) {
  const [isPending, startTransition] = useTransition();

  if (manuals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No manuals yet. Add your first manual to get started.
      </div>
    );
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this manual?")) {
      startTransition(async () => {
        await deleteManual(id, roomId);
      });
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {manuals.map((manual) => (
          <TableRow key={manual.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{manual.title}</div>
                  {manual.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {manual.description}
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {manual.filename}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatFileSize(manual.fileSize)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(manual.createdAt)}
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
                    <a href={`/api/files/${manual.id}`} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/rooms/${roomId}/manuals/${manual.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(manual.id)}
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
