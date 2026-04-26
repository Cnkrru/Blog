"""Blog Manager - Main entry point"""

import sys
import os
import logging

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ui.main_window import MainWindow


def _setup_logging():
    """Setup application logging"""
    log_format = '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


def main():
    """Application entry point"""
    _setup_logging()
    logger = logging.getLogger(__name__)
    logger.info('Starting Blog Manager...')
    
    try:
        app = MainWindow()
        app.mainloop()
    except Exception as e:
        logger.critical(f'Application crashed: {e}', exc_info=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
