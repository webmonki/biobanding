import style from './style';
import List from 'preact-material-components/List';

export default function createTable(data, editable, clickNew=undefined, clickEdit=undefined, clickDelete=undefined) {
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
				<th class={style.thIconContainer} onClick={clickNew}>
					<List.ItemGraphic class={style.thIcon}>group_add</List.ItemGraphic>
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
								<List.ItemGraphic onClick={() => clickEdit(row.userID)} class={style.tdIcon}>edit</List.ItemGraphic>
								<List.ItemGraphic onClick={() => clickDelete(row.userID)} class={style.tdIcon}>delete</List.ItemGraphic>
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
			<table id="measureTable">
				<thead>
					{tableHeader}
				</thead>
				{tableBody}
			</table>
		)

		return table
	}
}
