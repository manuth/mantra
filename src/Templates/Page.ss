
<!doctype html>
<html class="h-100">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        $MetaTags()

        <!-- Bootstrap core CSS -->
        <% require themedCSS("mantra") %>
        <% require themedJavascript("mantra") %>
    </head>
    <body class="d-flex flex-column h-100">
        <!-- Begin page content -->
        <main role="main" class="flex-shrink-0">
            <div class="container">
                <h1 class="display-4">
                    $MenuTitle
                </h1>
                $Content
            </div>
        </main>
    </body>
</html>