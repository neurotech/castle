import { getAllMaintenance } from "@/actions/maintenance";
import { PageHeader } from "@/components/layout/page-header";
import { TaskList } from "@/components/maintenance/task-list";

export default async function MaintenancePage() {
  const tasks = await getAllMaintenance();

  return (
    <>
      <PageHeader
        title="Maintenance Overview"
        description="All maintenance tasks across your home, sorted by due date"
      />
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No maintenance tasks yet. Add tasks to your rooms to see them here.
        </div>
      ) : (
        <TaskList tasks={tasks} roomId="" showRoomName />
      )}
    </>
  );
}
