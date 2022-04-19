import style from './style';
import List from 'preact-material-components/List';
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';
import 'preact-material-components/Checkbox/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { h, Component } from 'preact';

export default function createTable(data, editable, key=undefined, clickEdit=undefined, checkDelete=undefined) {
	try{
		var cols = Object.keys(data[0]);
	}
	catch (err) {
		cols = []
	}


	if (!editable) {
		let tableHeader = (
			<tr>
				{cols.map((name) => <th>{name}</th>)}
			</tr>
		)
	
	
		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr>
						{Object.keys(row).map((key) => 
						<td>{row[key]}</td>
						)}
					</tr>
				)}
			</tbody>
		)
	
		let table = (
			<table>
				<thead>
					{tableHeader}
				</thead>
				{tableBody}
			</table>
		)

		return table

	}
	else {

		let tableHeader = (
			<tr>
				<th>
				</th>
				{cols.map((name) => <th>{name}</th>)}
			</tr>
		)

		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr>
						<td>
							<div class={style.tdIconContainer}>
								<List.ItemGraphic onClick={() => clickEdit(row[key])} class={style.tdIcon}>edit</List.ItemGraphic>
								<Formfield>
									<Checkbox name='deleteCheck' value={row[key]}/>
								</Formfield>
							</div>
						</td>
						{Object.keys(row).map((key) => 
						<td>{row[key]}</td>
						)}
					</tr>
				)}
			</tbody>
		)

		let table = (
			<table id="table">
				<thead>
					{tableHeader}
				</thead>
				{tableBody}
			</table>
		)

		return table
	}
}
