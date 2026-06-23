<?php

declare(strict_types=1);

// Point to the root vendor autoload since mcp/sdk is installed in the main project
require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/PhpFileAnalyzer.php';

use Mcp\Server;
use Mcp\Server\Transport\StdioTransport;
use PhpMcpServer\PhpFileAnalyzer;

/**
 * Creates and configures the PHP MCP server.
 */
$server = Server::builder()
    ->setServerInfo('my-php-mcp-server', '1.0.0', 'Official PHP MCP Server implementation')
    ->addTool(
        handler: function (string $filePath): string {
            return (new PhpFileAnalyzer)->analyze($filePath);
        },
        name: 'analyze_php_file',
        description: 'Analyzes a PHP class file for style, dead code, security, and Eloquent practices.'
    )
    ->build();

$transport = new StdioTransport;
$server->run($transport);
