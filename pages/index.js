import styles from "../styles/index";
import isValidMap from "./functions/isValidMap";

import { useState } from "react";
import { FormControl, Button, Table } from "react-bootstrap";
import { w3cwebsocket as WebSocket } from "websocket";

import "bootstrap/dist/css/bootstrap.min.css";

const serverUrl = "ws://localhost:8000";
const ws = new WebSocket(serverUrl);
ws.onopen = () => {
	console.log("WebSocket connnects to " + serverUrl);
};

export default function Home() {
	const [mapInput, setMapInput] = useState("");
	const [map, setMap] = useState("");
	const [reports, setReports] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState('');

	const sendMapHandler = () => {
    console.log(isValidMap(mapInput));
    if(!isValidMap(mapInput)) {
      setError('Input Error');
      return;
    }
    setError("");
		ws.send(mapInput);
		setIsLoading(true);
		ws.onmessage = (message) => {
			const data = JSON.parse(message.data);
			const { map, ...reports } = data;
			map && setMap(data.map);
			map && setIsLoading(false);
			reports && setReports(reports);
		};
	};

	return (
		<div style={styles.container}>
			<h1> Robot Cleaner</h1>
			<FormControl
				style={styles.mapInput}
				as="textarea"
				aria-label="With textarea"
				onChange={(event) => {
					setMapInput(event.target.value);
				}}
			/>
      {error && (<span>{error}</span>)}
			<Button
				style={styles.button}
				onClick={() => {
					sendMapHandler(mapInput);
				}}
				disabled={isLoading || (reports && reports.emptyBlocks > 0)}
				typevariant="primary"
				size="lg"
			>
				{isLoading ? "Connecting to Server" : "Start Cleaning "}
			</Button>
			{map && <pre style={styles.map}>{map}</pre>}
			{reports && (
				<Table style={styles.table} striped bordered hover>
					<thead>
						<tr>
							<th>Map Height</th>
							<th>Map Width</th>
							<th>Total Blocks</th>
							<th>Blocks Cleaned</th>
							<th>Uncleaned Blocks</th>
							<th>Cleaned Percentage</th>
							<th>New Blocks Cleaned per Second</th>
							<th>Steps Took</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{reports.height}</td>
							<td>{reports.width}</td>
							<td>{reports.height * reports.width}</td>
							<td>{reports.totalEmptyBlocks - reports.emptyBlocks}</td>
							<td>{reports.emptyBlocks}</td>
							<td>
								{Math.floor(
									((reports.totalEmptyBlocks - reports.emptyBlocks) /
										reports.totalEmptyBlocks) *
										100
								) + "%"}
							</td>
							<td>
								{(
									(reports.totalEmptyBlocks - reports.emptyBlocks) /
									(reports.stepsTook * 0.2)
								).toFixed(2)}
							</td>
							<td>{reports.stepsTook}</td>
						</tr>
					</tbody>
				</Table>
			)}
		</div>
	);
}
