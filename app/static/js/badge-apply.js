var textCount = 1;
var fileCount = 0;
var urlCount = 0;
$('.btn-add-evidence').click(function() {
	$(this).hide();
	$('.evidence-type').removeClass('hide');
});

$('.text-evidence').click(function() {
	$('.btn-add-evidence').before('<div id="input-text-evidence' + textCount + '" class="form-group">'
		+'<button type="button" onclick="removeTextEvidence(' + textCount + ');" class="text-evidence-close close pull-right">&times;</button>'
		+'<label>Dẫn chứng #' + (textCount + 1) + '</label>'
		+'<textarea name="text" class="form-control" rows="3"></textarea>'
		+'<p class="help-block text-left">Một đoạn mô tả ngắn gọn về những bằng chứng mà bạn có, nó sẽ được dùng để so sánh với các điều kiện của badge</p>'
		+'</div>');
	++textCount;
	showAddEvidenceButton();
});

function removeTextEvidence(index) {
	$('#input-text-evidence' + index).remove();
	textCount--;
}

function removeFileEvidence(index) {
	$('#input-file-evidence' + index).remove();
	fileCount--;
}

function removeUrlEvidence(index) {
	$('#input-url-evidence' + index).remove();
	urlCount--;
}

$('.file-evidence').click(function() {
	$('.btn-add-evidence').before('<div id="input-file-evidence' + fileCount + '" class="form-group">'
		+'<button type="button" onclick="removeFileEvidence(' + fileCount + ');" class="file-evidence-close close pull-right" aria-hidden="true">&times;</button>'
		+'<label>File #' + (fileCount + 1) + ' </label>'
		+'<input name="listFile" class="form-control" type="file"/><br/>'
		+'<textarea name="fileDescription" class="form-control" rows="3" placeholder="Mô tả về file..."></textarea>'
		+'<p class="help-block text-left">File có thể là dạng hình ảnh, txt, doc, hoặc âm thanh,...</p>'
		+'</div>');
	++fileCount;
	showAddEvidenceButton();
});

$('.url-evidence').click(function() {
	$('.btn-add-evidence').before('<div id="input-url-evidence' + urlCount + '" class="form-group">'
		+'<button type="button" onclick="removeUrlEvidence(' + urlCount + ');" class="url-evidence-close close pull-right" aria-hidden="true">&times;</button>'
		+'<label>Url #' + (urlCount + 1) + '</label>'
		+'<input name="url" class="form-control" type="text" placeholder="http://domain.com"/><br/>'
		+'<p class="help-block text-left">Bạn có thể cung cấp bằng chứng dưới dạng đường link, nó có thể là đường dẫn tới trang web'
		+' của bạn hoặc trang web cơ sở chứng nhận khả năng của bạn</p>'
		+'</div>');
	++urlCount;
	showAddEvidenceButton();
});

function showAddEvidenceButton() {
	$('.evidence-type').addClass('hide');
	$('.btn-add-evidence').show();
}

$('.application-submit').click(function() {
	$('#form-badge-application').submit();
})

//validation
$('#form-badge-application').validate({
    rules: {
        text: {
            required: true,
        }
    }, 
    messages: {
        text: {
            required: "Bằng chứng đầu tiên không được bỏ trống.",
        }
    }, 
    errorClass: "help-block",
    errorElement: "small",
    highlight: function(element) {
        $(element).parent().removeClass('has-success').addClass('has-error');
    },
    success: function(label) {
        $(label).parent().removeClass('has-error').addClass('has-success');
    }
});
