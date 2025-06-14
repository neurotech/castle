import { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Panel } from "../../components/Panel";

import { Connector } from "../../components/Connector";
import { Loading } from "../../components/Loading";
import { getUrlPrefix } from "../../utils/getUrlPrefix";
import { useConfig, type Address } from "../../hooks/useConfig";

const getPropertyURL = (address: string) =>
	`${getUrlPrefix()}api/property?address=${encodeURIComponent(address)}`;

const activeStyles: Record<string, string> = {
	true: "border-velvet-600 bg-velvet-950",
	false: "border-velvet-900 bg-velvet-950/50",
};

export const Properties = () => {
	const [activeImage, setActiveImage] = useState<string>("");
	const [activeAddress, setActiveAddress] = useState<Address>();
	const [imageLoading, setImageLoading] = useState<boolean>(false);

	useEffect(() => {
		getConfig("properties");
	}, []);

	const {
		data: addresses,
		loading,
		error,
		getConfig,
	} = useConfig<Address, Address[]>();

	return (
		<Panel
			loading={loading}
			error={error}
			heading="Properties"
			content={
				<section className="flex flex-row">
					<div className="flex flex-col gap-2">
						{addresses?.map((address) => {
							return (
								<div
									key={address.value.slug}
									className="flex flex-row justify-center items-center"
								>
									<Button
										label={address.value.label}
										onClick={() => {
											setImageLoading(true);
											if (activeImage === address.id) {
												setActiveImage("");
												setActiveAddress(undefined);
											} else {
												setActiveImage(address.id || "");
												setActiveAddress(address);
											}
										}}
									/>
									<Connector
										isActive={activeAddress?.id === address.id}
										lineWidth={20}
									/>
								</div>
							);
						})}
					</div>

					<div
						className={`${activeStyles[Boolean(activeAddress).toString()]} flex border-1 rounded-sm p-1 flex-1 justify-center items-center min-h-[250px]`}
					>
						{activeAddress ? (
							<a
								href={getPropertyURL(activeAddress.value.slug)}
								target="_blank"
								rel="noreferrer"
							>
								{imageLoading && <Loading />}
								<img
									src={getPropertyURL(activeAddress.value.slug)}
									alt={activeAddress.value.label}
									className="object-cover object-left w-fit h-60 self-center invert saturate-0"
									style={{ display: `${imageLoading ? "none" : "block"}` }}
									onLoad={() => setImageLoading((p) => !p)}
								/>
							</a>
						) : (
							<aside>Select a property.</aside>
						)}
					</div>
				</section>
			}
		/>
	);
};
