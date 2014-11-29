var issueUrlRegularExpression = new RegExp(
		"https:\/\/github.com\/(.+)\/(.+)\/(issues|pull)\/(.+)");
var githubUrl = "";

function moveCard(val) {
	var listId = getListId(val);
	var moveCardUrl = "https://api.trello.com/1/cards/" + findCard()
			+ "/idList?key=" + getTrelloApplicationKey() + "&token="
			+ getTrelloApplicationAccessToken() + "&value=" + listId;
	$.ajax({
		type : "put",
		url : moveCardUrl,
		data : null,
		dataType : 'JSON',
		success : function(data) {
			console.log("put is success");
		},
		error : function(data) {
			console.log("put is not success");
		}
	});
}

function findCard() {
	var findCardUrl = "https://api.trello.com/1/boards/" + getTrelloBoardId()
			+ "/cards?fields=desc&key=" + getTrelloApplicationKey() + "&token="
			+ getTrelloApplicationAccessToken();
	var descRegularExpression = new RegExp(".*https:\/\/github.com\/"
			+ getGithubOwner() + "\/" + getGithubRepo() + "\/(issues|pull)\/"
			+ getGithubIssuesNumber() + ".*");
	var cardId = null;
	$.ajaxSetup({
		async : false
	});
	$.getJSON(findCardUrl, null, function(data) {
		for (i in data) {
			if (data[i].desc.match(descRegularExpression)) {
				cardId = data[i].id;
				console.log("cardId:" + cardId);
				break;
			}
		}
	});
	$.ajaxSetup({
		async : true
	});
	return cardId;
}

function changeLabel(label) {
	console.log("label is " + label);
	var labelUrl = "https://api.github.com/repos/" + getGithubOwner() + "/"
			+ getGithubRepo() + "/issues/" + getGithubIssuesNumber()
			+ "/labels?access_token=" + getGithubAccessToken();

	var stateLabels = [ 'doing', 'accepting', 'reopen', 'done' ];
	var putLabels = [ label ];

	$.when($.getJSON(labelUrl, null, function(data, status) {
		for (i in data) {
			var labelName = data[i].name;
			if ($.inArray(labelName, stateLabels) == -1) {
				putLabels.push(labelName);
			}
		}
	})).then(function() {
		$.ajax({
			type : "put",
			url : labelUrl,
			data : JSON.stringify(putLabels),
			dataType : 'JSON',
			success : function(data) {
				console.log("put is success");
			},
			error : function(data) {
				console.log("put is not success");
			}
		});
	});

}

function getGithubUrl() {
	chrome.windows.getCurrent(function(window) {
		chrome.tabs.getSelected(window.id, function(tab) {
			console.log(tab.url);
			githubUrl = tab.url;
		});
	});
}

function getGithubOwner() {
	return githubUrl.match(issueUrlRegularExpression)[1];
}

function getGithubRepo() {
	return githubUrl.match(issueUrlRegularExpression)[2];
}

function getGithubIssuesNumber() {
	return githubUrl.match(issueUrlRegularExpression)[4];
}

function getGithubAccessToken() {
	return localStorage.getItem("github_access_token");
}

function getTrelloBoardId() {
	return localStorage.getItem("trello_board_id");
}
function getTrelloApplicationKey() {
	return localStorage.getItem("trello_application_key");
}
function getTrelloApplicationAccessToken() {
	return localStorage.getItem("trello_application_access_token");
}

function getListId(val) {
	var listId = localStorage.getItem("trello_" + val + "_list_id");
	console.log("listId:" + listId);
	return listId;
}

getGithubUrl();
$("div.btn-group").on("click", function(events) {
	console.log("buttons clicked");
	var val = $(events.target).children(':first-child').val();
	changeLabel(val);
	moveCard(val);
});