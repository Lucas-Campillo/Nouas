function HideShowForm()
{
    
    if(document.getElementById('NewNews').style.display === 'block')
	{
		document.getElementById('NewNews').style.display = 'none'
	}else
	{
		document.getElementById('NewNews').style.display = 'block'
	}
}

function UpdateNews(id)
{
	if(document.getElementById('UpdateNews'+id).style.display === 'none')
	{
		document.getElementById('UpdateNews'+id).style.display = 'block'
		document.getElementById('News'+id).style.display = 'none'
	}else
	{
		document.getElementById('UpdateNews'+id).style.display = 'none'
		document.getElementById('News'+id).style.display = 'block'
	}
}