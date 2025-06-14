import { GitHub } from "../GitHub/GitHub";
import { LivingWorlds } from "../LivingWorlds/LivingWorlds";
import { PathOfExile } from "../PathOfExile/PathOfExile";
import { Properties } from "../Properties/Properties";

export const HomeTab = () => {
	return (
		<section className="grid grid-cols-[373px_1fr_0.75fr_373px] gap-2">
			<section className="flex flex-col gap-2 w-fit">
				<LivingWorlds />
			</section>

			<section className="flex flex-col gap-2">
				<GitHub />
			</section>

			<section className="flex flex-col gap-2">
				<Properties />
			</section>

			<section className="flex flex-col gap-2">
				<PathOfExile />
			</section>
		</section>
	);
};
