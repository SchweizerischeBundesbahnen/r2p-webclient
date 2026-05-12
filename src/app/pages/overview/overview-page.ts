import { Component } from '@angular/core';

@Component({
    selector: 'app-traffic-overview',
    imports: [],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1 class="page-title">Traffic Overview</h1>
                    </div>
                    <a href="create.html" class="btn btn-success"> ＋ New Train </a>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <div class="filter-group">
                        <label for="filter-train-number">Train Number</label>
                        <input
                            type="text"
                            id="filter-train-number"
                            class="filter-input"
                            placeholder="e.g., IC 1234"
                            oninput="applyFilters()"
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-year">Timetable Year</label>
                        <select id="filter-year" class="filter-select" onchange="applyFilters()">
                            <option value="">All years</option>
                            <option value="2025" selected>2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filter-from">Op. Day From</label>
                        <input
                            type="date"
                            id="filter-from"
                            class="filter-input"
                            onchange="applyFilters()"
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-to">Op. Day To</label>
                        <input
                            type="date"
                            id="filter-to"
                            class="filter-input"
                            onchange="applyFilters()"
                        />
                    </div>
                    <div class="filter-group" style="flex: 0; min-width: 100px;">
                        <label for="clear">&nbsp;</label>
                        <button id="clear" class="btn btn-ghost" onclick="clearFilters()">
                            Clear
                        </button>
                    </div>
                </div>

                <!-- Train Table -->
                <div class="table-container">
                    <table id="trains-table">
                        <thead>
                            <tr>
                                <th class="sort-header" id="th-trainNumber">
                                    Train No. <span class="sort-indicator"></span>
                                </th>
                                <th>From</th>
                                <th>To</th>
                                <th class="sort-header" id="th-operationalDay">
                                    Op. Day <span class="sort-indicator"></span>
                                </th>
                                <th>Partners</th>
                                <th class="sort-header" id="th-lastChange">
                                    Last Change / Version <span class="sort-indicator"></span>
                                </th>
                                <th>
                                    Status
                                    <span class="tooltip-anchor" tabindex="0"
                                        >?<span class="tooltip-box"
                                            >🟢 Circle: All activities are
                                            <em>confirmed</em>.<br />🟧 Square: At least one
                                            activity is <em>proposed</em> or <em>requested</em>,
                                            none refused.<br />🔺 Triangle: At least one activity is
                                            <em>refused</em> or <em>dropped</em>.</span
                                        ></span
                                    >
                                </th>
                            </tr>
                        </thead>
                        <tbody id="trains-tbody">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
                <div id="empty-state" class="empty-state" style="display:none;">
                    <div class="empty-state-icon">🚆</div>
                    <p class="empty-state-text">No trains found</p>
                    <p class="text-muted" style="font-size:0.875rem;">
                        Try adjusting your filters or create a new train.
                    </p>
                </div>
            </div>
        </div>
    `,
    styles: ``,
})
export class OverviewPage {}
